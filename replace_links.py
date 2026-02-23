import os
import glob
import re

directory = r'c:\Users\JANMEJAY\Desktop\Edvera1'
html_files = glob.glob(os.path.join(directory, '*.html'))

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        def replacer(match):
            a_tag = match.group(0)
            
            # Remove js-open-diagnostic
            a_tag = a_tag.replace('js-open-diagnostic', '')
            
            # Fix duplicate spaces in class attribute
            a_tag = re.sub(r'class=\"([^\"]*)\"', lambda m: 'class=\"' + ' '.join(m.group(1).split()) + '\"', a_tag)
            
            # Remove class="" if empty
            a_tag = a_tag.replace('class=\"\"', '')
            
            # Replace href=\"#\" with calendly link
            a_tag = re.sub(r'href=\"([^\"]*)\"', r'href="https://calendly.com/admissions-edvera/new-meeting" target="_blank"', a_tag)
            
            return a_tag
            
        new_content = re.sub(r'<a[^>]*js-open-diagnostic[^>]*>', replacer, content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {os.path.basename(file_path)}")
            
    except Exception as e:
        print(f"Failed on {file_path}: {e}")
