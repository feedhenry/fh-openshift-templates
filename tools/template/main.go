package main

import (
	"os"

	"github.com/fheng/fh-openshift-templates/tools/template/cmd"
	_ "github.com/openshift/origin/pkg/api/install"
)

func main() {
	if err := cmd.NewRootCommand(os.Stdin, os.Stdout, os.Stderr).Execute(); err != nil {
		os.Exit(1)
	}
}
