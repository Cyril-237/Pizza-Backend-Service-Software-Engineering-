# Coding Conventions

Code of Conduct
- We use established coding conventions for all development artifacts; Conventions to be used for a specific artifact is defined in this document
- Whenever possible, coding conventions should be checkable and/or highlighted in the developer's local development environment
- Violation of a coding convention will fail the build in an early stage (see [CI/CD Strategy](../cicd_strategy/README.md))


## Python Code
The coding convention for Python facilitated in this project is described in [PEP 8 -- Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/)

Documentation links:
- [How to setup your local development environment?](../local_dev_setup/README.md)
- [How does the CI/CD-pipeline implement the checking?](../cicd_strategy/README.md)

### Key points for naming stuff

**General**
- Avoid using names that are too general or too wordy. Strike a good balance between the two.
- Bad: data_structure, my_list, info_map, dictionary_for_the_purpose_of_storing_data_representing_word_definitions
- Good: user_profile, menu_options, word_definitions
- Don’t be a jackass and name things “O”, “l”, or “I”
- When using CamelCase names, capitalize all letters of an abbreviation (e.g. HTTPServer)

**Packages**
- Package names should be all lower case
- When multiple words are needed, an underscore should separate them
- It is usually preferable to stick to 1 word names

**Modules**
- Module names should be all lower case
- When multiple words are needed, an underscore should separate them
- It is usually preferable to stick to 1 word names

**Classes**
- Class names should follow the UpperCaseCamelCase convention
- Python's built-in classes, however are typically lowercase words
- Exception classes should end in “Error”

**Global (module-level) Variables**
- Global variables should be all lowercase
- Words in a global variable name should be separated by an underscore

**Instance Variables**
- Instance variable names should be all lower case
- Words in an instance variable name should be separated by an underscore
- Non-public instance variables should begin with a single underscore
- If an instance name needs to be mangled, two underscores may begin its name

**Methods**
- Method names should be all lower case
- Words in an method name should be separated by an underscore
- Non-public method should begin with a single underscore
- If a method name needs to be mangled, two underscores may begin its name

**Method Arguments**
- Instance methods should have their first argument named ‘self’. 
- Class methods should have their first argument named ‘cls’

**Functions**
- Function names should be all lower case
- Words in a function name should be separated by an underscore

**Constants**
- Constant names must be fully capitalized
- Words in a constant name should be separated by an underscore