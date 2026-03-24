# Use the latest Jenkins agent image with RHEL UBI 9 and JDK 21
FROM jenkins/agent:latest-rhel-ubi9-jdk21 
# Same as Jenkins packer-image 
ARG asdf_version=0.15.0
ENV TZ=UTC
USER root

# Install asdf
RUN git clone https://github.com/asdf-vm/asdf.git /tmp/asdf --branch v${asdf_version} \
    && chmod +x /tmp/asdf/bin/asdf

# Add asdf and asdf shims to global PATH
ENV PATH="/tmp/asdf/bin:/home/jenkins/.asdf/shims:$PATH"

# Switch to jenkins user        
USER jenkins

WORKDIR /app

# Copy .tool-versions to container and convert to Unix line endings
COPY .tool-versions package.json package-lock.json ./

# Normalize .tool-versions, install Node.js via asdf, then install npm dependencies
RUN sed -i 's/\r$//' .tool-versions \
    && asdf plugin add nodejs && asdf plugin update nodejs && asdf install \
    && npm install

COPY . .
# Convert .tool-versions to Unix line endings again in case it was modified during COPY
RUN sed -i 's/\r$//' .tool-versions

EXPOSE 8000

CMD ["npm", "run", "develop", "--", "-H", "0.0.0.0", "-p", "8000"]
