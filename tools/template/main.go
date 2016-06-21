package main

import (
	"os"

	"github.com/fheng/fh-openshift-templates/tools/template/cmd"
	_ "github.com/openshift/origin/pkg/api/install"
	"github.com/spf13/pflag"
)

func main() {
	// Hide flag automatically added by Kubernetes.
	pflag.Lookup("log-flush-frequency").Hidden = true

	pflag.Bool("debug", false, "Output debug information.")

	if err := cmd.NewRootCommand(os.Stdin, os.Stdout, os.Stderr).Execute(); err != nil {
		os.Exit(1)
	}
}
