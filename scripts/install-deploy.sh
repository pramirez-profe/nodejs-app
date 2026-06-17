# Instala e inicia docker
sudo dnf install -y docker
sudo systemctl enable --now docker
# Instala manualmente la extension docker compose
sudo mkdir -p /usr/libexec/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m) -o /usr/libexec/docker/cli-plugins/docker-compose
sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose

# Despliega los contenedores
sudo docker compose -f /home/ssm-user/docker-compose.yml up -d 
