# Cf., https://github.com/schmunk42/nginx-proxy#proxy-wide
FROM jwilder/nginx-proxy       
RUN { \
      echo 'server_tokens off;'; \
      echo 'client_max_body_size 64M;'; \
      echo 'proxy_busy_buffers_size 512k;'; \
      echo 'proxy_buffers 4 512k;'; \
      echo ' proxy_buffer_size 256k;'; \
    } > /etc/nginx/conf.d/my_proxy.conf
