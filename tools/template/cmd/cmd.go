package cmd

import (
	"io"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

func NewRootCommand(stdin io.Reader, stdout, stderr io.Writer) *cobra.Command {
	cmd := &cobra.Command{
		Use:   filepath.Base(os.Args[0]),
		Short: "Command line tool for working with OpenShift templates",
	}
	cmd.AddCommand(NewMergeCommand(stdin, stdout, stderr))
	return cmd
}
