#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据抽取模块 - 《千载格物》项目
Data Extraction Module for Ancient Chinese Science Project

功能：从不同数据源（网页、PDF、文本）提取原始数据
"""

import requests
import json
import re
from bs4 import BeautifulSoup
import PyPDF2
import pdfplumber
from typing import Dict, List, Optional
from datetime import datetime
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataExtractor:
    """数据抽取器 - 从不同数据源提取原始数据"""
    
    def __init__(self):
        """初始化数据抽取器"""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def extract_from_webpage(self, url: str) -> Dict[str, str]:
        """
        从网页提取数据
        
        Args:
            url: 目标网页URL
            
        Returns:
            包含标题、内容、元数据的字典
        """
        try:
            logger.info(f"开始从网页提取数据: {url}")
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            response.encoding = response.apparent_encoding
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 提取标题
            title = soup.find('title')
            title_text = title.get_text().strip() if title else "无标题"
            
            # 提取主要内容（优先查找main、article标签，否则使用body）
            main_content = soup.find('main') or soup.find('article') or soup.find('body')
            content = main_content.get_text().strip() if main_content else ""
            
            # 清理内容（移除多余空白字符）
            content = re.sub(r'\s+', ' ', content)
            
            # 提取元数据
            meta_data = {
                'url': url,
                'title': title_text,
                'content_length': len(content),
                'extraction_time': datetime.now().isoformat(),
                'status': 'success'
            }
            
            logger.info(f"成功从 {url} 提取数据，内容长度: {len(content)}")
            
            return {
                'title': title_text,
                'content': content,
                'metadata': meta_data
            }
            
        except Exception as e:
            logger.error(f"从 {url} 提取数据失败: {str(e)}")
            return {
                'title': '', 
                'content': '', 
                'metadata': {
                    'url': url,
                    'error': str(e),
                    'status': 'failed',
                    'extraction_time': datetime.now().isoformat()
                }
            }
    
    def extract_from_pdf(self, pdf_path: str) -> Dict[str, str]:
        """
        从PDF文件提取文本
        
        Args:
            pdf_path: PDF文件路径
            
        Returns:
            包含文本内容和元数据的字典
        """
        try:
            logger.info(f"开始从PDF提取文本: {pdf_path}")
            
            text_content = ""
            
            # 优先使用pdfplumber（更好的中文支持）
            try:
                with pdfplumber.open(pdf_path) as pdf:
                    for page_num, page in enumerate(pdf.pages):
                        page_text = page.extract_text()
                        if page_text:
                            text_content += f"=== 第{page_num + 1}页 ===\n"
                            text_content += page_text + "\n\n"
                
                logger.info(f"使用pdfplumber成功提取PDF文本")
                
            except Exception as e:
                logger.warning(f"pdfplumber提取失败，尝试使用PyPDF2: {str(e)}")
                
                # 备用方案：使用PyPDF2
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page_num, page in enumerate(pdf_reader.pages):
                        page_text = page.extract_text()
                        if page_text:
                            text_content += f"=== 第{page_num + 1}页 ===\n"
                            text_content += page_text + "\n\n"
                
                logger.info(f"使用PyPDF2成功提取PDF文本")
            
            # 清理文本内容
            text_content = re.sub(r'\s+', ' ', text_content)
            
            meta_data = {
                'file_path': pdf_path,
                'content_length': len(text_content),
                'extraction_time': datetime.now().isoformat(),
                'status': 'success'
            }
            
            logger.info(f"成功从 {pdf_path} 提取文本，长度: {len(text_content)}")
            
            return {
                'content': text_content,
                'metadata': meta_data
            }
            
        except Exception as e:
            logger.error(f"从 {pdf_path} 提取文本失败: {str(e)}")
            return {
                'content': '', 
                'metadata': {
                    'file_path': pdf_path,
                    'error': str(e),
                    'status': 'failed',
                    'extraction_time': datetime.now().isoformat()
                }
            }
    
    def extract_from_text_file(self, file_path: str, encoding: str = 'utf-8') -> Dict[str, str]:
        """
        从文本文件提取内容
        
        Args:
            file_path: 文本文件路径
            encoding: 文件编码
            
        Returns:
            包含文本内容和元数据的字典
        """
        try:
            logger.info(f"开始从文本文件提取内容: {file_path}")
            
            with open(file_path, 'r', encoding=encoding) as file:
                content = file.read()
            
            # 清理内容
            content = re.sub(r'\s+', ' ', content)
            
            meta_data = {
                'file_path': file_path,
                'encoding': encoding,
                'content_length': len(content),
                'extraction_time': datetime.now().isoformat(),
                'status': 'success'
            }
            
            logger.info(f"成功从 {file_path} 提取文本，长度: {len(content)}")
            
            return {
                'content': content,
                'metadata': meta_data
            }
            
        except Exception as e:
            logger.error(f"从 {file_path} 提取文本失败: {str(e)}")
            return {
                'content': '', 
                'metadata': {
                    'file_path': file_path,
                    'error': str(e),
                    'status': 'failed',
                    'extraction_time': datetime.now().isoformat()
                }
            }
    
    def batch_extract_webpages(self, urls: List[str]) -> List[Dict[str, str]]:
        """
        批量提取网页数据
        
        Args:
            urls: URL列表
            
        Returns:
            提取结果列表
        """
        results = []
        
        for url in urls:
            result = self.extract_from_webpage(url)
            results.append(result)
            
            # 添加延迟避免请求过于频繁
            import time
            time.sleep(1)
        
        return results
    
    def extract_with_retry(self, url: str, max_retries: int = 3) -> Dict[str, str]:
        """
        带重试机制的数据提取
        
        Args:
            url: 目标URL
            max_retries: 最大重试次数
            
        Returns:
            提取结果
        """
        for attempt in range(max_retries):
            try:
                result = self.extract_from_webpage(url)
                if result['metadata']['status'] == 'success':
                    return result
                
                logger.warning(f"第{attempt + 1}次尝试失败，准备重试...")
                
            except Exception as e:
                logger.error(f"第{attempt + 1}次尝试异常: {str(e)}")
            
            if attempt < max_retries - 1:
                import time
                time.sleep(2 ** attempt)  # 指数退避
        
        # 所有重试都失败
        return {
            'title': '',
            'content': '',
            'metadata': {
                'url': url,
                'error': '所有重试都失败',
                'status': 'failed',
                'extraction_time': datetime.now().isoformat()
            }
        }

# 使用示例
if __name__ == "__main__":
    # 创建数据抽取器
    extractor = DataExtractor()
    
    # 示例：提取网页数据
    test_url = "https://example.com/ancient-science"
    result = extractor.extract_from_webpage(test_url)
    
    print("提取结果:")
    print(f"标题: {result['title']}")
    print(f"内容长度: {len(result['content'])}")
    print(f"状态: {result['metadata']['status']}")
    
    # 示例：提取PDF数据
    # test_pdf = "path/to/ancient_science.pdf"
    # pdf_result = extractor.extract_from_pdf(test_pdf)
    # print(f"PDF内容长度: {len(pdf_result['content'])}")
