FROM node:lts-hydrogen
ENV NPM_CONFIG_LOGLEVEL warn
EXPOSE 3000

#
# Sometimes the host user's id doesn't align with the container user's id.
# If there are any permission errors, this is one likely cause
#
# 2023-3-28 I think it's because I used `useradd` instead of `adduser`.
#           Did the `id` incremement by 1 because of it?
#
#RUN usermod -u 1001 node

USER node
ENV HOME=/home/node

WORKDIR $HOME

ENV PATH $HOME/node_modules/.bin:$PATH

ADD api/package.json $HOME
RUN npm install --omit=dev

CMD ["node", "./app.js"]

