import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from typing import List, Dict
import os

class ImageProcessor:
    def __init__(self):
        self.supported_formats = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    
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
        
        # 1. Color Histograms
        hist_gray = cv2.calcHist([gray], [0], None, [256], [0, 256])
        hist_hsv = cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
        
        cv2.normalize(hist_gray, hist_gray, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
        cv2.normalize(hist_hsv, hist_hsv, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
        
        # 2. Edge Detection (Shape similarity)
        edges = cv2.Canny(gray, 50, 150)
        edge_hist = cv2.calcHist([edges], [0], None, [256], [0, 256])
        cv2.normalize(edge_hist, edge_hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
        
        # 3. ORB Features (Keypoint detection)
        orb = cv2.ORB_create(nfeatures=100)
        keypoints, descriptors = orb.detectAndCompute(gray, None)
        
        features = {
            'histogram_gray': hist_gray.flatten(),
            'histogram_hsv': hist_hsv.flatten(),
            'edge_histogram': edge_hist.flatten(),
            'orb_descriptors': descriptors,
            'shape': img.shape,
            'mean_color': cv2.mean(img)[:3],
        }
        
        return features
    
    def compare_histograms(self, hist1: np.ndarray, hist2: np.ndarray) -> float:
        """Compare two histograms using correlation"""
        similarity = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
        return max(0, similarity * 100)
    
    def compare_orb_features(self, desc1, desc2) -> float:
        """Compare ORB descriptors using BFMatcher"""
        if desc1 is None or desc2 is None:
            return 0.0
        
        try:
            bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
            matches = bf.match(desc1, desc2)
            
            if len(matches) == 0:
                return 0.0
            
            # Calculate similarity based on matches
            good_matches = sorted(matches, key=lambda x: x.distance)
            
            # Take top 50 matches
            top_matches = good_matches[:min(50, len(good_matches))]
            
            # Calculate average distance
            avg_distance = sum([m.distance for m in top_matches]) / len(top_matches)
            
            # Convert to similarity score (lower distance = higher similarity)
            max_distance = 100
            similarity = (1 - (avg_distance / max_distance)) * 100
            
            return max(0, min(100, similarity))
            
        except Exception as e:
            print(f"Error comparing ORB features: {e}")
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
            
            # 1. Gray histogram similarity (20% weight)
            gray_sim = self.compare_histograms(
                features1['histogram_gray'],
                features2['histogram_gray']
            )
            
            # 2. HSV histogram similarity (30% weight)
            hsv_sim = self.compare_histograms(
                features1['histogram_hsv'],
                features2['histogram_hsv']
            )
            
            # 3. Edge histogram similarity (20% weight)
            edge_sim = self.compare_histograms(
                features1['edge_histogram'],
                features2['edge_histogram']
            )
            
            # 4. ORB feature similarity (30% weight)
            orb_sim = self.compare_orb_features(
                features1['orb_descriptors'],
                features2['orb_descriptors']
            )
            
            # Weighted average
            similarity = (
                gray_sim * 0.2 +
                hsv_sim * 0.3 +
                edge_sim * 0.2 +
                orb_sim * 0.3
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
        
        for img_path in image_files:
            img_path_str = str(img_path)
            
            if img_path_str == source_image_path:
                continue
            
            similarity = self.calculate_similarity(source_image_path, img_path_str)
            
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