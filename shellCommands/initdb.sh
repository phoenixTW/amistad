mkdir data
node scripts/initializeDB.js data/users.db 
mkdir tests/data
node scripts/initializeDB.js tests/data/users.db
sqlite3 tests/data/users.db < scripts/insertData.sql
sqlite3 tests/data/users.db < scripts/insertPosts.sql
cp tests/data/users.db tests/data/users.db.backup