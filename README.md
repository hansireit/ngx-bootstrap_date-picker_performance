# ngx-bootstrap Date-Picker performance test
A repository to showcase a performance problem with the ngx-bootstrap datepicker.

## Reproduction
To reproduce this issue, start the application with **npm run start**.
When you visit the site on  [localhost:1002](http://localhost:1002), the automated clicker will start opening the datepickers randomly.
If you start clicking on the input fields manually as well, the tab will get slower and it eventually freezes. Even if you just hover over the input fields, it will get slower.

## StackBlitz
See the project on [StackBlitz ⚡️](https://stackblitz.com/edit/angular-ivy-xnumn9)
