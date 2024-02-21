packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = " >= 1.1.4 "
    }
  }
}

variable "project_id" {
  type    = string
  default = "csye6225-413808"
}



source "googlecompute" "centos" {
  project_id           = var.project_id
  zone                 = "us-central1-a"
  source_image_family  = "centos-stream-8"
  image_name           = "webapp-image-${formatdate("YYYYMMDDHHmmss", timestamp())}"
  ssh_username         = "centos"
}

build {
  sources = ["source.googlecompute.centos"]

  provisioner "file" {
    source      = "application.zip"
    destination = "/tmp/application.zip"
  }


  provisioner "shell" {
    script          = "/tmp/secure_mysql_installation.sh"
  }

  provisioner "shell" {
    script          = "/tmp/install_node.sh"
  }

  provisioner "shell" {
    script          = "/tmp/usergroup.sh"
  }

  provisioner "shell" {
    script          = "/tmp/nodeapp.sh"
  }
}
