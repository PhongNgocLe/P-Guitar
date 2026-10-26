<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">

        <!-- Scripts -->
        @routes
        @php
            $viteHotFile = public_path('hot');
            $viteManifestFile = public_path('build/manifest.json');
        @endphp
        @if (file_exists($viteHotFile))
            @php
                $viteServer = rtrim(trim(file_get_contents($viteHotFile)), '/');
            @endphp
            <script type="module">
                import RefreshRuntime from '{{ $viteServer }}/@react-refresh'
                RefreshRuntime.injectIntoGlobalHook(window)
                window.$RefreshReg$ = () => {}
                window.$RefreshSig$ = () => (type) => type
                window.__vite_plugin_react_preamble_installed__ = true
            </script>
            <script type="module" src="{{ $viteServer }}/@vite/client"></script>
            <script type="module" src="{{ $viteServer }}/resources/js/app.jsx"></script>
        @elseif (file_exists($viteManifestFile))
            @php
                $viteManifest = json_decode(file_get_contents($viteManifestFile), true);
            @endphp
            @if (isset($viteManifest['resources/js/app.jsx']))
                @foreach ($viteManifest['resources/js/app.jsx']['css'] ?? [] as $cssFile)
                    <link rel="stylesheet" href="{{ asset('build/'.$cssFile) }}">
                @endforeach
                <script type="module" src="{{ asset('build/'.$viteManifest['resources/js/app.jsx']['file']) }}"></script>
            @else
                @php
                    throw new \RuntimeException('Vite entry resources/js/app.jsx is missing from the build manifest.');
                @endphp
            @endif
        @else
            @php
                throw new \RuntimeException('Vite assets are missing. Run npm run dev or npm run build.');
            @endphp
        @endif
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
