<?php $active = explode('.',explode('/',$_SERVER['SCRIPT_NAME'])[3])[0]; ?>
    <header class="subpage-header">
        <div class="content">
            <h1>TSG <span class="fancy">Creative</span></h1>
            <nav class="nav-main">
                <a href="index.html" <?php echo ( $active == 'index' ? "class='active'" : '' ); ?>>
                    <svg viewBox="0 0 100 100" class="icon">
                        <use xlink:href="#icon-home"></use>
                    </svg>
                    <span>Home</span>
                </a>
                <a href="games.html" <?php echo ( $active == 'games' ? "class='active'" : '' ); ?>>
                    <svg viewBox="0 0 100 100" class="icon">
                        <use xlink:href="#icon-game-controller"></use>
                    </svg>
                    <span>Games</span>
                </a>
                <a href="dataviz.html" <?php echo ( $active == 'dataviz' ? "class='active'" : '' ); ?>>
                    <svg viewBox="0 0 100 100" class="icon">
                        <use xlink:href="#icon-bars"></use>
                    </svg>
                    <span>Data Visualization</span>
                </a>
                <a href="dashboards.html" <?php echo ( $active == 'dashboards' ? "class='active'" : '' ); ?>>
                    <svg viewBox="0 0 100 100" class="icon">
                        <use xlink:href="#icon-meter"></use>
                    </svg>
                    <span>Dashboards</span>
                </a>
            </nav>
        </div>
    </header>
