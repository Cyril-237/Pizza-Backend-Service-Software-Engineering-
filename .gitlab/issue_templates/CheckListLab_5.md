---
name: Checklist Lab 5
about: Template for evaluation of lab results

---

# Expected Results
- [ ] The pipeline contains a new task "service testing"
- [ ] The task "service_testing" is well configured, belongs to a reasonable stage and waits for the completed setup of the staging environment
- [ ] All provided service tests run successfully (13 successful, 1 test skipped) 
- [ ] The service test for the beverages (*test_beverage.tavern*) is complete and contains reasonable edge cases
- [ ] The preparation for the Logging exercise was done (there are plenty of log-commands in the code)
- [ ] The follow-up results including the logging were pushed to the main-branch successfully

# General
- [ ] The pipeline is green for all tasks and stages (especially the Acceptance Stage including the service tests)
- [ ] The pipeline fails when any task (especially Service Tests and SonarQube) reports problems (no "allow_failure: true" anymore)
- [ ] The history of the pipeline shows that the team knows how to use branches and merge requests before pushing to main
- [ ] The team follows the practices for CI/CD. If the recent history of your pipeline contains failed runs, the pipeline was fixed within 15 minutes 
- [ ] SonarQube does not report any problems in the project 
- [ ] The coverage is higher than 75%
- [ ] The result was committed in time
- [ ] All teammates made some commits 

# Comments / Hints
- 

# Result (traffic light rating)
- 
