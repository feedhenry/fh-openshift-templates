# fh-openshift-templates - testing

## Template suites

To create a template suite create a file in the `suites/` directory following the
pattern of existing files.

The object exported in each suite is used by [leche](https://github.com/box/leche),
an extension to `mocha` which allows for tests to be executed multiple times on
different objects.

The syntax should be as follows

```javascript
suitename: {
  "templatename": ["/path/to/template", options]
}
```

Once saved you should be able to run

```shell
npm test run --suite=suitename
```
