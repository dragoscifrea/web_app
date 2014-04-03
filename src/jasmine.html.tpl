<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Jasmine Spec Runner</title>
  <link rel="stylesheet" href="<%- jasminePath %>jasmine.css">
</head>
<body>
  <div id="sandbox" style="overflow:hidden; height:1px;"></div>
  <script src="<%- jasminePath %>jasmine.js"></script>
  <script src="<%- jasminePath %>jasmine-html.js"></script>
  <script src="<%- requirePath %>" data-main="<%- require %>"></script>
</body>
</html>
