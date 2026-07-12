import os

log_path = r'C:\Users\aditya tiwari\.gemini\antigravity-ide\brain\c77bc0b5-88b3-473f-841d-8b1896e38e43\.system_generated\tasks\task-699.log'
if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8') as f:
        print(f.read())
else:
    print("Log file not found")
