packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = " >= 1.0.0 "
    }
  }
}

variable "project_id" {
  type = string
}



source "googlecompute" "centos" {
  project_id          = var.project_id
  zone                = "us-central1-a"
  source_image_family = "centos-stream-8"
  image_name          = "webapp-image-${formatdate("YYYYMMDDHHmmss", timestamp())}"
  ssh_username        = "centos"
}

build {
  sources = ["source.googlecompute.centos"]

  provisioner "file" {
    source      = "application"
    destination = "/tmp/application.zip"
  }



  provisioner "shell" {
    script = "secure_mysql_installation.sh"
  }

  provisioner "shell" {
    script = "install_node.sh"
  }

  provisioner "shell" {
    script = "usergroup.sh"
  }

  provisioner "shell" {
    script = "nodeapp.sh"
  }
}
