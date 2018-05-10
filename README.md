# fibo-domain
The tool for downloading and importing domain.

# Dev
#### Install go
- Search on google and install go by yourself.
- Make sure that the go version greater or equals 1.8
- Export the enviroments like belows
```
export GOROOT=/usr/local/opt/go/libexec
export GOPATH=~/go
export GOBIN=$GOPATH/bin
export PATH=$PATH:$GOPATH:$GOBIN
```

#### Build import and log first
```
go build -o bin/import-excel go/import-excel.go
go build -o bin/logd go/log-download.go
```

#### Install packages
```
yarn #or npm install
```

#### Start development
```
yarn dev
```

# Deploy
Remember to export these enviroments
```
export FIBO_HOME=/home/deployer/fibo-domain
export FIBO_DB_NAME=fibo
```

Make sure you set the right `FIBO_HOME` and `FIBO_DB_HOME`
