import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from typing import List, Dict
import os

class ImageProcessor:
    def __init__(self):
        self.supported_formats = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        # Updated: Initialize SIFT detector
        self.sift = cv2.SIFT_create()
    
    def load_image(self, image_path: str) -> np.ndarray:
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Could not load image: {image_path}")
            return img
        except Exception as e:
            print(f"Error loading image: {e}")
            return None
    
    def resize_image(self, img: np.ndarray, max_size: int = 800) -> np.ndarray:
        height, width = img.shape[:2]
        
        if max(height, width) > max_size:
            if height > width:
                new_height = max_size
                new_width = int(width * (max_size / height))
            else:
                new_width = max_size
                new_height = int(height * (max_size / width))
            
            img = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
        
        return img
    
    def extract_features(self, img: np.ndarray) -> Dict:
        """Extract multiple types of features"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # 1. Color Histograms (Using 16x12x12 bins for better color granularity)
        hist_gray = cv2.calcHist([gray], [0], None, [256], [0, 256])
        hist_hsv = cv2.calcHist([hsv], [0, 1, 2], None, [16, 12, 12], [0, 180, 0, 256, 0, 256])
        
        cv2.normalize(hist_gray, hist_gray, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
        cv2.normalize(hist_hsv, hist_hsv, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
        
        # 2. Edge Detection (Shape similarity)
        edges = cv2.Canny(gray, 50, 150)
        edge_hist = cv2.calcHist([edges], [0], None, [256], [0, 256])
        cv2.normalize(edge_hist, edge_hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
        
        # 3. Updated: SIFT Features (Keypoint detection)
        keypoints, descriptors = self.sift.detectAndCompute(gray, None)
        
        features = {
            'histogram_gray': hist_gray.flatten(),
            'histogram_hsv': hist_hsv.flatten(),
            'edge_histogram': edge_hist.flatten(),
            'sift_keypoints': keypoints,
            'sift_descriptors': descriptors,
            'shape': img.shape,
            'mean_color': cv2.mean(img)[:3],
        }
        
        return features
    
    def compare_histograms(self, hist1: np.ndarray, hist2: np.ndarray) -> float:
        """
        Compare two histograms using Bhattacharyya distance.
        Bhattacharyya distance: 0 = perfect match, 1 = total mismatch.
        We return 1 - distance to get a similarity score (0 to 100).
        """
        distance = cv2.compareHist(hist1, hist2, cv2.HISTCMP_BHATTACHARYYA)
        similarity = 1 - distance
        return max(0, similarity * 100)
    
    def compare_sift_features(self, desc1, desc2, kpts1, kpts2) -> float:
        """
        Compare SIFT descriptors using BFMatcher and Lowe's Ratio Test.
        """
        if desc1 is None or desc2 is None or len(kpts1) == 0 or len(kpts2) == 0:
            return 0.0
        
        try:
            # Use BFMatcher with NORM_L2 for SIFT
            bf = cv2.BFMatcher(cv2.NORM_L2)
            # Find 2 best matches for each descriptor (knnMatch)
            matches = bf.knnMatch(desc1, desc2, k=2)
            
            # Apply Lowe's Ratio Test
            good_matches = []
            for m, n in matches:
                # m is the best match, n is the second best
                if m.distance < 0.75 * n.distance:
                    good_matches.append(m)
            
            # Calculate similarity
            # Score based on the number of good matches relative to the average number of keypoints
            if len(good_matches) == 0:
                return 0.0
            
            avg_kpts = (len(kpts1) + len(kpts2)) / 2.0
            if avg_kpts == 0:
                return 0.0
                
            # Similarity is the ratio of good matches to the average number of keypoints
            # We can cap this at 100%
            similarity = (len(good_matches) / avg_kpts) * 100
            
            return max(0, min(100, similarity))
            
        except Exception as e:
            print(f"Error comparing SIFT features: {e}")
            return 0.0
    
    def calculate_similarity(self, img1_path: str, img2_path: str) -> float:
        """Calculate similarity using multiple algorithms"""
        try:
            img1 = self.load_image(img1_path)
            img2 = self.load_image(img2_path)
            
            if img1 is None or img2 is None:
                return 0.0
            
            img1 = self.resize_image(img1)
            img2 = self.resize_image(img2)
            
            features1 = self.extract_features(img1)
            features2 = self.extract_features(img2)
            
            # 1. Gray histogram similarity (15% weight)
            gray_sim = self.compare_histograms(
                features1['histogram_gray'],
                features2['histogram_gray']
            )
            
            # 2. HSV histogram similarity (30% weight)
            hsv_sim = self.compare_histograms(
                features1['histogram_hsv'],
                features2['histogram_hsv']
            )
            
            # 3. Edge histogram similarity (15% weight)
            edge_sim = self.compare_histograms(
                features1['edge_histogram'],
                features2['edge_histogram']
            )
            
            # 4. Updated: SIFT feature similarity (40% weight)
            sift_sim = self.compare_sift_features(
                features1['sift_descriptors'],
                features2['sift_descriptors'],
                features1['sift_keypoints'],
                features2['sift_keypoints']
            )
            
            # Weighted average (Updated weights)
            similarity = (
                gray_sim * 0.15 +
                hsv_sim * 0.30 +
                edge_sim * 0.15 +
                sift_sim * 0.40
            )
            
            return round(similarity, 2)
            
        except Exception as e:
            print(f"Error calculating similarity: {e}")
            return 0.0
    
    def find_similar_images(
        self, 
        source_image_path: str, 
        image_directory: str,
        top_k: int = 20
    ) -> List[Dict]:
        """Find top K similar images"""
        results = []
        
        image_files = []
        for ext in self.supported_formats:
            image_files.extend(Path(image_directory).glob(f'*{ext}'))
        
        # Pre-calculate features for the source image once
        try:
            source_img = self.load_image(source_image_path)
            if source_img is None:
                print(f"Failed to load source image: {source_image_path}")
                return []
            source_img = self.resize_image(source_img)
            source_features = self.extract_features(source_img)
        except Exception as e:
            print(f"Error processing source image: {e}")
            return []

        for img_path in image_files:
            img_path_str = str(img_path)
            
            if img_path_str == source_image_path:
                continue
            
            # Updated: We can't use the full calculate_similarity function directly
            # if we want to optimize. But for simplicity, we'll keep it.
            # A future optimization would be to pass features instead of paths.
            
            similarity = self.calculate_similarity_with_features(source_features, img_path_str)
            
            if similarity >= 70:
                category = 'high'
            elif similarity >= 40:
                category = 'medium'
            else:
                category = 'low'
            
            results.append({
                'image_path': img_path_str,
                'filename': img_path.name,
                'similarity': similarity,
                'category': category
            })
        
        results.sort(key=lambda x: x['similarity'], reverse=True)
        
        return results[:top_k]

    def calculate_similarity_with_features(self, features1: Dict, img2_path: str) -> float:
        """Helper function to compare features1 dict with img2_path"""
        try:
            img2 = self.load_image(img2_path)
            if img2 is None:
                return 0.0
            
            img2 = self.resize_image(img2)
            features2 = self.extract_features(img2)
            
            # 1. Gray histogram similarity
            gray_sim = self.compare_histograms(
                features1['histogram_gray'],
                features2['histogram_gray']
            )
            
            # 2. HSV histogram similarity
            hsv_sim = self.compare_histograms(
                features1['histogram_hsv'],
                features2['histogram_hsv']
            )
            
            # 3. Edge histogram similarity
            edge_sim = self.compare_histograms(
                features1['edge_histogram'],
                features2['edge_histogram']
            )
            
            # 4. SIFT feature similarity
            sift_sim = self.compare_sift_features(
                features1['sift_descriptors'],
                features2['sift_descriptors'],
                features1['sift_keypoints'],
                features2['sift_keypoints']
            )
            
            # Weighted average
            similarity = (
                gray_sim * 0.15 +
                hsv_sim * 0.30 +
                edge_sim * 0.15 +
                sift_sim * 0.40
            )
            
            return round(similarity, 2)
            
        except Exception as e:
            print(f"Error calculating similarity with features: {e}")
            return 0.0
