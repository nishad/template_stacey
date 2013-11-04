<?php

Class Asset {

  var $data;
  var $link_path;
  var $file_name;
  static $identifiers;

  function __construct($file_path) {
    # create and store data required for this asset
    $this->set_default_data($file_path);
  }

  function construct_link_path($file_path) {
    return preg_replace('/^\.\//', Helpers::relative_root_path(), $file_path);
  }

  function set_default_data($file_path) {
    # store link path
    $this->link_path = $this->construct_link_path($file_path);

    # extract filename from path
    $split_path = explode('/', $file_path);
    $this->file_name = array_pop($split_path);

    # set asset.url & asset.name variables
    $this->data['url'] = $this->link_path;
    $this->data['file_name'] = $this->file_name;
    $this->data['name'] = ucfirst(preg_replace(array('/[-_]/', '/\.[\w\d]+?$/', '/^\d+?\./'), array(' ', '', ''), $this->file_name));

    if (class_exists('finfo') && file_exists($file_path)) {
      $finfo = new finfo(FILEINFO_MIME_TYPE);
      if ($finfo) {
        $this->data['mime_type'] = $finfo->file($file_path);
      }
    }
    # asset.absolute_url
    $this->data['absolute_url'] = 'http://'.$_SERVER['HTTP_HOST'].str_replace('/index.php', '', $_SERVER['PHP_SELF']).'/'.str_replace('./','', $file_path);

    $timestamp = date("dmyHis", filemtime($file_path));

    #asset.time_query e.g ROOTPATH/asset.css?010213203045
    $this->data['time_query'] = $this->data['absolute_url'].'?'.$timestamp;

    # asset.time_string e.g. ROOTPATH/asset.010213203045.css (Better for proxies)
    $pos = strrpos($file_path, '.'); // find position of the last dot, so where the extension starts
    $exploded_path = substr($file_path, 0, $pos).'.'.$timestamp.substr($file_path, $pos);
    $this->data['time_string'] = 'http://'.$_SERVER['HTTP_HOST'].str_replace('/index.php', '', $_SERVER['PHP_SELF']).'/'.str_replace('./','', $exploded_path);

    # asset.file_size
    $this->data['file_size'] = filesize($file_path);
  }

}

?>
