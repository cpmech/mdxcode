# Tool to extract code from Markdown files

This tool extracts all the code from a markdown file. It has also an option to run the code (python or julia only atm).

## Installation

Install with:

```bash
npm install -g @cpmech/mdxcode
```

## Usage

```
  usage:
          mdxcode filename.md outputDir {true,false}

  where:
          {true,false} indicates to run the code or not
```

NOTE: you may run Python or Julia code (**warning** The execution of Julia code with figures is very slow).

## Example

```
mdxcode examples/example1.md /tmp/out true
```

Output:

```
Processing "example1" in "examples"
file </tmp/out/example1-code0.py> written
file </tmp/out/example1-code0.png> written
file </tmp/out/example1-code0.out> written
file </tmp/out/example1-code1.jl> written
file </tmp/out/example1-code1.out> written
file </tmp/out/example1-code2.jl> written
file </tmp/out/example1-code2.svg> written
```
