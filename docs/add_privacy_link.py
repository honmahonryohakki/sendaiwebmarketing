import os
import re

# 対象ディレクトリ
root_dir = r"c:\Users\365of\Desktop\My\LP\docs"

def process_file_path(file_path):
    file_name = os.path.basename(file_path)
    # 除外ファイル: 既に手動で更新したもの
    if "marketer-training.html" in file_name or "privacy-policy.html" in file_name:
        return

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 既にリンクが存在する場合はスキップ（簡易チェック）
        # ただし、ヘッダーにはないはずだが、念のため footer-nav 付近でチェックしたいが、
        # ここではファイル全体に privacy-policy.html があればスキップとする安全策をとる。
        if "privacy-policy.html" in content:
            print(f"Already exists (skipping): {file_name}")
            return

        # リンクパスの構築
        rel_path = os.path.relpath(file_path, root_dir)
        segments = rel_path.split(os.sep)
        depth = len(segments) - 1
        
        target_link = "./privacy-policy.html" if depth == 0 else ("../" * depth + "privacy-policy.html")
        insertion = f'\n        <a href="{target_link}">プライバシーポリシー</a>'

        # 挿入位置の特定
        # <nav class="footer-nav"> の開始位置を探す
        nav_start = content.find('class="footer-nav"')
        if nav_start == -1:
            print(f"Skipping {file_name}: No footer-nav found")
            return
            
        # nav_start 以降で "会社概要</a>" を探す
        company_link_index = content.find('会社概要</a>', nav_start)
        if company_link_index == -1:
            print(f"Skipping {file_name}: No About link in footer")
            return
            
        # "</a>" の長さ(4)を足して、タグの直後に挿入する
        insert_pos = company_link_index + 4
        
        new_content = content[:insert_pos] + insertion + content[insert_pos:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print(f"Updated: {file_name}")
        
    except Exception as e:
        print(f"Error {file_name}: {e}")

# ファイル走査
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".html"):
            process_file_path(os.path.join(root, file))
