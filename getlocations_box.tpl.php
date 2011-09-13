<?php

/**
 * @file getlocations_box.tpl.php
 * Template file for colorbox implementation
 */

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>">
<!-- getlocations_box -->
<head>
  <title><?php print $head_title; ?></title>
  <?php print $head; ?>
  <?php print $styles; ?>
  <?php print $scripts; ?>
<style>
  body {
    width: 490px;
    margin: 0;
  }
  #page {
    min-width: 490px;
    width: 490px;
    margin-left: 8px;
  }
  #content-area {
  }
</style>
</head>
<body class="<?php print $body_classes; ?>">
  <div id="page"><div id="page-inner">
    <div id="main"><div id="main-inner" class="clear-block">
      <div id="content"><div id="content-inner">
        <?php if ($title): ?>
          <h2 class="title"><?php print $title; ?></h2>
        <?php endif; ?>
        <div id="content-area">
          <?php print $content; ?>
        </div>
      </div></div>
    </div></div>
  </div></div>
  <?php print $closure; ?>
</script>
</body>
</html>