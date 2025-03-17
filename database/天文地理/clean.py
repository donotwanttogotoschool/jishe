import pandas as pd
import os

# 指定文件夹路径 (使用正斜杠或双反斜杠)
folder_path = 'D:/计设/作品/作品2/database/物理'  # 或者 'D:\\计设\\作品\\作品2\\database\\化学'

# 遍历文件夹中的所有文件
for filename in os.listdir(folder_path):
    # 只处理CSV文件
    if filename.endswith('.csv'):
        # 构建完整的文件路径
        file_path = os.path.join(folder_path, filename)
        
        try:
            # 读取CSV文件，添加error_bad_lines=False来跳过有问题的行
            df = pd.read_csv(file_path, on_bad_lines='skip')
            
            # 删除重复行
            df.drop_duplicates(inplace=True)
            
            # 构建输出文件名（在原文件名后添加"_clean"）
            output_filename = os.path.splitext(filename)[0] + '_clean.csv'
            output_path = os.path.join(folder_path, output_filename)
            
            # 保存处理后的文件
            df.to_csv(output_path, index=False)
            print(f'已处理文件: {filename} -> {output_filename}')
        except Exception as e:
            print(f'处理文件 {filename} 时出错: {str(e)}')