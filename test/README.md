# fh-openshift-templates - testing tool

## Adding new templates to the testing tool

When a new template is added it can be added to the template tool.

Either add the template to an existing file in the `components/` directory or create
a new one. All modules within the `components/` directory are automatically brought in
to the tool.

When defining a template you'll need the following information

* Path to the template itself

* What ports the template exposes

* Whether there are any environment variables in the template that are not given
a value by a parameter

Once you have this information you can construct the configuration for the test.
The testing tool uses [leche](https://github.com/box/leche) syntax to define tests,
the format for these is as follows:

```javascript
key: {
  "template-name": [require("/path/to/template.json"), options]
}
```
where:
* `key` is the name which you can pass in the `--components` argument to only call
that test, (e.g. `npm run test --components=key`)

* `options` is an ***optional*** object with the following format:

```javascript
{
  ports: [
    {componentPort: 3000},
    {componentPort: 8080, protocol: "UDP"}
  ],
  ignoreEnv: [
    "THIS_ENV_VAR_NAME",
    "THAT_ENV_VAR_NAME"
  ]
}
```
where:
* `ports` is a list of object with a `componentPort` and a `protocol` key.
  - If the `protocol` is not specified it will default to TCP
  - `componentPort` is required

* `ignoreEnv` is a list of environment variable names in the template to not check whether it has
a corresponding parameter

The object exported in each suite is used by [leche](https://github.com/box/leche),
an extension to `mocha` which allows for tests to be executed multiple times on
different objects.

## Adding groups of templates to the testing tool

The testing tool can also support groups of templates. These are objects which
contain multiple single configurations. For example:

```javascript
messagingMetrics: {
  "fh-metrics": [require("/path/to/template.json"), options],
  "fh-messaging": [require("/path/to/template.json"), options]
}
```

Then running `npm run test --components=messagingMetrics` will run tests on
both the messaging and the metrics templates.

***Note*** If two or more templates only need to be tested together once or very
rarely then it is better to run `npm run test --components="messaging metrics"`.
This will have the same result as defining the group within a file.
