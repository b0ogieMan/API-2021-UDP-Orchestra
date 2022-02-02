<#
.SYNOPSIS
   Script to validate the docker containers
.DESCRIPTION
   This script will kill and remove all containers on the computer. It will rebuild the lab images and run them, then run the validation container and check that everithing works
#>

Write-Host ""
Write-Host ""
Write-Host "*** Killing all running containers"
Write-Host ""
docker ps -a --format "{{.Image}}" | ForEach-Object {
   if(($_ -eq "api/auditor") -or ($_ -eq "api/musician") -or ($_ =-eq "api/validate-music")){
      Write-Host $_
   }
}
#docker rm $(docker ps -a -q)

#
# Let's get rid of existing images...
#
Write-Host ""
Write-Host ""
Write-Host "*** Deleting our 3 Docker images, if they exist"
Write-Host ""
docker rmi api/auditor
docker rmi api/musician
docker rmi api/validate-music

#
# ... and rebuild them
#
Write-Host ""
Write-Host ""
Write-Host "*** Rebuilding our 3 Docker images"
Write-Host ""
docker build --tag api/musician --file ./docker/image-musician/Dockerfile ./docker/image-musician/
docker build --tag api/auditor --file ./docker/image-auditor/Dockerfile ./docker/image-auditor/
docker build --tag api/validate-music --file ./docker/image-validation/Dockerfile ./docker/image-validation/

#
# We start a single container. The Node.js application executed in this container will use
# a npm package to control Docker. It will start/stop musician and auditor containers and check that
# the auditor works as expected.
#
Write-Host ""
Write-Host ""
Write-Host "*** Starting validation..."
Write-Host ""
git remote -v | Tee-Object check.log
docker run --name api_validation -v /var/run/docker.sock:/var/run/docker.sock api/validate-music | Tee-Object -a check.log