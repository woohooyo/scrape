run_mssql:
	docker start mssql || docker run -d --name 'mssql' -e 'ACCEPT_EULA=Y' \
		-e 'SA_PASSWORD=Reg@)!&!!!!' -e 'MSSQL_PID=Express' \
		-p 1433:1433 microsoft/mssql-server-linux:2017-latest
