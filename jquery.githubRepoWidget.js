;jQuery(document).ready(function($){
	
	var i = 0;
	var box_title_png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAAAAAAjaEA4AAAAAnRSTlMA/1uRIrUAAABwSURBVHgB1Yy1AcNAEASv/5Ie98TMsXNXIeavQJMt0g/WGnkjodIwkvGGpMqyLV2rGBPfsdzWd4b5yzJaa3WhDZXh+ERRca7OYZEsCaBuX2i7Gswou5VC0z/xA58B9oMFPxhoLeswPofjZvnjGJzWBMtZccawge0MAAAAAElFTkSuQmCC';
	var stats_png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAAAAACWkiQMAAAAwElEQVR4AcXQQ2IFMQCA4d7/Bn9tG7vatm3reWxjPRPni1Onp4TMsbAzOblTiGBtgZ6jo24WawG+dDKoFgrKAF2vHp7Vw0UBCudQf+biEXBerK8vnQHH3vKHNgbkckXup/0xOKg8Q+f+ficz5ciVfjbGxzd+8/qQ/FFsnEtikfkEimNcxFEa40j3MLCT+EGiaarkYWD62JQSwQsOdH2NszBWd7kR9Xf21RBeQNPHRyv1R+HlgF1oYRStrkop4082APS7IXYonD9cAAAAAElFTkSuQmCC';

	var vendors = {};

	//Group repos keyed by vendor(username)
	$('.github-widget').each(function(){
		var repo = $(this).data('repo'), 
			vendorName = repo.split('/')[0], 
			repoName = repo.split('/')[1];
		if ( !vendors[ vendorName ] )  vendors[ vendorName ] = {};
		vendors[ vendorName ][ repoName ] = $(this) ;
	});


	if ( vendors ){
		$('head').append(
			'<style type="text/css">'
			+'.github-box *{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;}'
			+'.github-box{font-family:helvetica,arial,sans-serif;font-size:13px;line-height:18px;background:#fafafa;border:1px solid #ddd;color:#666;border-radius:3px}'
			+'.github-box a{color:#4183c4;border:0;text-decoration:none}'
			+'.github-box .github-box-title{position:relative;border-bottom:1px solid #ddd;border-radius:3px 3px 0 0;background:#fcfcfc;background:-moz-linear-gradient(#fcfcfc,#ebebeb);background:-webkit-linear-gradient(#fcfcfc,#ebebeb);}'
			+'.github-box .github-box-title h3{word-wrap:break-word;font-family:helvetica,arial,sans-serif;font-weight:normal;font-size:16px;color:gray;margin:0;padding:10px 10px 10px 30px;background:url('+box_title_png+') 7px center no-repeat; width: auto;}'
			+'.github-box .github-box-title h3 .repo{font-weight:bold}'
			+'.github-box .github-box-title .github-stats{float:right;position:absolute;top:8px;right:10px;font-size:11px;font-weight:bold;line-height:21px;height:auto;min-height:21px}'
			+'.github-box .github-box-title .github-stats a{display:inline-block;height:21px;color:#666;border:1px solid #ddd;border-radius:3px;padding:0 5px 0 18px;background: white url('+stats_png+') no-repeat}'
			+'.github-box .github-box-title .github-stats .watchers{border-right:1px solid #ddd}'
			+'.github-box .github-box-title .github-stats .forks{background-position:-4px -21px;padding-left:15px}'
			+'.github-box .github-box-content{padding:10px;font-weight:300}'
			+'.github-box .github-box-content p{margin:0}'
			+'.github-box .github-box-content .link{font-weight:bold}'
			+'.github-box .github-box-download{position:relative;border-top:1px solid #ddd;background:white;border-radius:0 0 3px 3px;padding:10px;height:auto;min-height:24px;}'
			+'.github-box .github-box-download .updated{word-wrap:break-word;margin:0;font-size:11px;color:#666;line-height:24px;font-weight:300;width:auto}'
			+'.github-box .github-box-download .updated strong{font-weight:bold;color:#000}'
			+'.github-box .github-box-download .download{float:right;position:absolute;top:10px;right:10px;height:24px;line-height:24px;font-size:12px;color:#666;font-weight:bold;text-shadow:0 1px 0 rgba(255,255,255,0.9);padding:0 10px;border:1px solid #ddd;border-bottom-color:#bbb;border-radius:3px;background:#f5f5f5;background:-moz-linear-gradient(#f5f5f5,#e5e5e5);background:-webkit-linear-gradient(#f5f5f5,#e5e5e5);}'
			+'.github-box .github-box-download .download:hover{color:#527894;border-color:#cfe3ed;border-bottom-color:#9fc7db;background:#f1f7fa;background:-moz-linear-gradient(#f1f7fa,#dbeaf1);background:-webkit-linear-gradient(#f1f7fa,#dbeaf1);}'
			+'@media (max-width: 767px) {'
			+'.github-box .github-box-title{height:auto;min-height:60px}'
			+'.github-box .github-box-title h3 .repo{display:block}'
			+'.github-box .github-box-title .github-stats a{display:block;clear:right;float:right;}'
			+'.github-box .github-box-download{height:auto;min-height:46px;}'
			+'.github-box .github-box-download .download{top:32px;}'
			+'}'
			+'</style>'
		);

		for (var vendor in vendors){
			$.ajax({
				url: 'https://api.github.com/users/' + vendor + '/repos',
				dataType: 'jsonp',
				cache: true,
				success: function(results) {
					
					$.each(results.data, function( repoIndex) {
						var repo = results.data[repoIndex];
						var date, pushed_at = 'unknown',
							vendorUrl = "http://github.com/" + vendor,
							repoUrl = "http://github.com/" + vendor + '/' + repo.name;

						var $widget = $(
							'<div class="github-box repo">'
							+'<div class="github-box-title">'
							+'<h3>'
							+'<a class="owner" href="' + vendorUrl + '" title="' + vendorUrl + '">' + vendor + '</a>'
							+'/'
							+'<a class="repo" href="' + repoUrl + '" title="' + repoUrl + '">' + repo.name + '</a>'
							+'</h3>'
							+'<div class="github-stats">'
							+'<a class="watchers" href="' + repoUrl + '/watchers" title="See watchers">?</a>'
							+'<a class="forks" href="' + repoUrl + '/network/members" title="See forkers">?</a>'
							+'</div>'
							+'</div>'
							+'<div class="github-box-content">'
							+'<p class="description"><span></span> &mdash; <a href="' + repoUrl + '#readme">Read More</a></p>'
							+'<p class="link"></p>'
							+'</div>'
							+'<div class="github-box-download">'
							+'<div class="updated"></div>'
							+'<a class="download" href="' + repoUrl + '/zipball/master" title="Get an archive of this repository">Download as zip</a>'
							+'</div>'
							+'</div>'
						);

						$widget.appendTo( vendors[vendor][repo.name] );

						if (repo.pushed_at) {
							date = new Date(repo.pushed_at);
							pushed_at = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
						}

						$widget.find('.watchers').text(repo.watchers);
						$widget.find('.forks').text(repo.forks);
						$widget.find('.description span').text(repo.description);
						$widget.find('.updated').html('Latest commit to the <strong>' + repo.default_branch + '</strong> branch on ' + pushed_at);

						// Don't show "null" if the repo has no homepage URL.
						if(repo.homepage != null) $widget.find('.link').append($('<a />').attr('href', repo.homepage).text(repo.homepage));
					});
				}
			});

		}
	}
});
