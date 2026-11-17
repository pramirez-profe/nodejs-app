# Demo Istio (ambient)

Requisito: `kubectl apply -f kubernetes/` ya aplicado (con GATEWAY_NAME/GATEWAY_NAMESPACE completados).

## 1. AuthorizationPolicy: solo node-app habla con MySQL

```bash
# Antes: cualquier pod del namespace puede conectarse (mTLS, pero sin restricción)
kubectl run mysql-client -n nodejs-app --rm -it --restart=Never --image=mysql:8 -- \
  mysql -h mysql -unode -pnode -e "select 1"      # funciona

kubectl apply -f kubernetes/istio/authorization-policy.yaml

# Después: el mismo intento es rechazado, y la API sigue funcionando
kubectl run mysql-client -n nodejs-app --rm -it --restart=Never --image=mysql:8 -- \
  mysql -h mysql -unode -pnode -e "select 1"      # error: conexión rechazada
curl http://<dns-del-nlb>/api/alumnos             # OK
```

## 2. Canary 80/20

```bash
kubectl apply -f kubernetes/istio/canary.yaml
for i in $(seq 20); do curl -s http://<dns-del-nlb>/api/alumnos | grep -o '"version":"[^"]*"'; done | sort | uniq -c
```

Cambia los `weight` en `canary.yaml` (ej. 50/50, 0/100) y vuelve a aplicar para ver el reparto en vivo.
Para volver al estado inicial (el delete también borra el HTTPRoute, por eso se reaplica después):

```bash
kubectl delete -f kubernetes/istio/canary.yaml
kubectl apply -f kubernetes/httproute.yaml
```
