import sqlite3

c = sqlite3.connect("prisma/dev.db")
print(c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
print(c.execute("PRAGMA table_info(Paper)").fetchall())
