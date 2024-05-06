# Project Diagram
![flow drawio](https://github.com/RamaRaju-personal-org/webapp/assets/144737522/7798b670-f957-4417-9e13-ee4f579e6e36)

# Initialize Node..
```bash
npm init
```
# Installing pacakges, ORM & database driver
```bash
npm i mysql express  sequelize mysql2 dotenv    

npm install --save-dev jest supertest
```

# Update Package.json
```json
"scripts": {
    "test": "jest",
    "start": "node index.js"
  },
  "jest": {
    "testEnvironment": "node"
  },
```


# Check Databases available & port connection
```bash
# Databases check (give mysql password)
mysql -h localhost -u root -p -e "SHOW DATABASES;"

# MySql Process check (give your system pasword)
sudo lsof -iTCP -sTCP:LISTEN -n -P | grep mysqld
```

# API Enpoints testing for /healthz
##  GET Request
```bash
#without payload
curl -vvvv http://localhost:3307/healthz

#with payload
curl -X GET http://localhost:3307/healthz -H "Content-Type: application/json" -d '{"name": "Rama Raju"}'
```

## PUT Request check for 405 
```bash
#without payload
curl -vvvv -XPUT http://localhost:3307/healthz

#with payload
curl -X PUT 'http://localhost:3307/healthz' -H 'Content-Type: application/json' -d '{"name": "Rama Raju"}'

```

## POST Request check for 405
```bash
#without payload 
curl -X POST 'http://localhost:3307/healthz'

#with payload
curl -X POST 'http://localhost:3307/healthz' -H 'Content-Type: application/json' -d '{"name": "Rama Raju"}'
```

## DELETE Request check for 405
```bash
curl -X DELETE 'http://localhost:3307/healthz'
```

## PATCH Request check for 405
```bash
#without payload
curl -X PATCH 'http://localhost:3307/healthz'

#with payload
curl -X PATCH 'http://localhost:3307/healthz' -H 'Content-Type: application/json' -d '{"name": "Rama Raju"}'
```


## Query Parameters Check
```bash
curl -X GET 'http://localhost:3307/healthz?name=ram&neuid=003'
```
# Unit Test using jest
```bash
npm test
```
# Stop the mysql process
```bash
sudo pkill mysqld
```
# Restart the mysql process
```bash
sudo /usr/local/mysql/support-files/mysql.server restart
```
# User Creation (POST)
```bash
/v1/user
```
# Get & put for authenticated users only
```bash
/v1/user/self
```

# Webapp Demo on Centos
## SCP the ziped application code to centos 
```bash
scp -i /path/to/your-ssh-private-key /path/to/your-file.zip centos@droplet-ip:/root
```

## SSH into the centos machine
```bash
#change the key permission
chmod 600 /path/to/your-private-key 

# ssh using private key
ssh -i /path/to/your-private-key root@droplet-ip

```
# Unzip the application &  install mysql
```bash
sudo dnf install unzip
unzip path/to/your-file.zip
# create the dotenv file for your app in the vm
# install mysql
sudo yum install wget

sudo wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm

sudo rpm -Uvh mysql80-community-release-el7-3.noarch.rpm

sudo yum install mysql-server

sudo systemctl start mysqld

sudo systemctl enable mysqld

# give your db credentials
sudo mysql_secure_installation

mysql --version

mysql -u root -p
```
# Install node js 
```bash
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -

sudo yum install -y nodejs

node --version

```
## Note : 
```bash
Enable port on which your application runs & give ssh access only to your ip in firewall settings of ypur vm
```
# query the table..
```bash
SELECT * FROM restapi.Users;
```
