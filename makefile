server:
	docker build -t webdev-server .
server-hub:
	docker build -t samhaswon/webdev-server:latest -t webdev-server:latest .