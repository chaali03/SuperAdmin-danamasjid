<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>DanaMasjid SuperAdmin</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    @vite('resources/js/app.tsx')
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
