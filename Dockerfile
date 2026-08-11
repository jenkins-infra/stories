# TODO: track version with updatecli - ref. https://github.com/jenkins-infra/jenkins-infra/blob/efe90908529525bb3c9e61c2eb920ada3b968f1a/updatecli/updatecli.d/jenkinscontroller-tools-maven.yaml#L17-L22
FROM jenkinsciinfra/jenkins-agent-ubuntu-22.04:2.118.0

USER root

RUN mkdir -p /app \
    && chown -R jenkins:jenkins /app

# Switch back to the non-root user
USER jenkins

WORKDIR /app

COPY --chown=jenkins:jenkins package*.json ./

RUN npm ci

COPY --chown=jenkins:jenkins . .

EXPOSE 8000

CMD ["npm", "run", "develop", "--", "-H", "0.0.0.0", "-p", "8000"]
