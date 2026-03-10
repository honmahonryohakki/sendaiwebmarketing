import os
import re

root_dir = r"c:\Users\365of\Desktop\My\LP\docs"

def fix_file(file_path):
    # 除外ファイル
    if "marketer-training.html" in file_path:
        return

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 誤ったパターンの検出
        # <a href="...about.html...">会社概要 (改行や空白) <a href="...privacy-policy.html...">プライバシーポリシー</a></a>
        # メモ: "会社概要" の直後に "</a>" がなく、その後に "プライバシーポリシー" リンクが続き、最後に "</a>" がある。
        
        # Regex explanation:
        # group 1: <a ... about.html ... >会社概要
        # group 2: (whitespace including newlines) <a ... privacy-policy.html ... >プライバシーポリシー</a>
        # group 3: </a>
        
        pattern = re.compile(
            r'(<a\s+[^>]*href=["\'][^"\']*about\.html["\'][^>]*>会社概要)'
            r'(\s*<a\s+[^>]*href=["\'][^"\']*privacy-policy\.html["\'][^>]*>プライバシーポリシー</a>)'
            r'(</a>)',
            re.IGNORECASE | re.DOTALL
        )
        
        if pattern.search(content):
            # 置換: group1 + group3 + group2
            # つまり: (会社概要...) + (</a>) + (プライバシーポリシー...)
            new_content = pattern.sub(r'\1\3\2', content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed: {os.path.basename(file_path)}")
        else:
            # 念のため、正しく挿入されているかもしれないケースや、対象外のケースを確認
            # "会社概要</a>" の後に "プライバシーポリシー" があるかチェック
            correct_pattern = re.compile(
                r'会社概要</a>\s*<a\s+[^>]*href=["\'][^"\']*privacy-policy\.html',
                re.IGNORECASE | re.DOTALL
            )
            if correct_pattern.search(content):
                # print(f"Already correct: {os.path.basename(file_path)}")
                pass
            else:
                # そもそも挿入されてない？ or 別の壊れ方？
                # print(f"Not matched pattern: {os.path.basename(file_path)}")
                pass

    except Exception as e:
        print(f"Error {file_path}: {e}")

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".html"):
            fix_file(os.path.join(root, file))
