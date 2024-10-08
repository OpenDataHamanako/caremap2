// 地図表示時の中心座標
var init_center_coords = [137.53162, 34.718471];

// map
var map;

// 保育施設JSON格納用オブジェクト
var nurseryFacilities = {};

// 中心座標変更セレクトボックス用データ
var moveToList = [];

// マップサーバ一覧
var mapServerList = {
    'osm': {
        label: "OSM",
        source_type: "osm",
        source: new ol.source.OSM({
            url: "https://{a-c}.tile.osm.org/{z}/{x}/{y}.png",
            attributions: [
                ol.source.OSM.DATA_ATTRIBUTION,
                new ol.Attribution({ html: "'&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors" })
            ]
        })
    }

};

/**
 * デバイス回転時、地図の大きさを画面全体に広げる
 * @return {[type]} [description]
 */
function resizeMapDiv() {
    var screenHeight = $.mobile.getScreenHeight();
    var contentCurrentHeight = $(".ui-content").outerHeight() - $(".ui-content").height();
    var contentHeight = screenHeight - contentCurrentHeight;
    var navHeight = $("#nav1").outerHeight();
    $(".ui-content").height(contentHeight);
    $("#map").height(contentHeight - navHeight);
}

$(window).on("orientationchange", function() {
    resizeMapDiv();
    map.setTarget('null');
    map.setTarget('map');
});


$('#mainPage').on('pageshow', function() {
    resizeMapDiv();

    // 地図レイヤー定義
    var papamamap = new Papamamap();
    papamamap.viewCenter = init_center_coords;
    papamamap.generate(mapServerList['osm']);
    map = papamamap.map;

    // 施設の読み込みとレイヤーの追加
    papamamap.loadNurseryFacilitiesJson(function(data) {
        nurseryFacilities = data;
    }).then(function() {
        papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
    });

    // ポップアップ定義
    var popup = new ol.Overlay({
        element: $('#popup')
    });
    map.addOverlay(popup);

    // 背景地図一覧リストを設定する
    for (var item in mapServerList) {
        option = $('<option>').html(mapServerList[item].label).val(item);
        $('#changeBaseMap').append(option);
    }

    // 施設クリック時の挙動を定義
    map.on('click', function(evt) {
        if ($('#popup').is(':visible')) {
            // ポップアップを消す
            $('#popup').hide();
            return;
        }

        // クリック位置の施設情報を取得
        obj = map.forEachFeatureAtPixel(
            evt.pixel,
            function(feature, layer) {
                return { feature: feature, layer: layer };
            }
        );

        var feature = null;
        var layer = null;
        if (obj !== undefined) {
            feature = obj.feature;
            layer = obj.layer;
        }
        // クリックした場所に要素がなんにもない場合、クリック位置に地図の移動を行う
        if (feature === null) {
            coord = map.getCoordinateFromPixel(evt.pixel);
            view = map.getView();
            papamamap.animatedMove(coord[0], coord[1], false);
            view.setCenter(coord);
        }

        // クリックした場所に既に描いた同心円がある場合、円を消す
        if (feature && layer.get('name') === 'layerCircle' &&
            feature.getGeometry().getType() === "Polygon") {
            $('#cbDisplayCircle').attr('checked', false).checkboxradio('refresh');
            clearCenterCircle();
        }

        // クリックした場所に施設がある場合、ポップアップダイアログを出力する
        if (feature && "Point" == feature.getGeometry().getType()) {
            var type = feature.get('種別') ? feature.get('種別') : feature.get('Type');
            if (type === undefined) {
                return;
            }
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();
            popup.setPosition(coord);

            // タイトル部
            var title = papamamap.getPopupTitle(feature);
            $("#popup-title").html(title);

            // 内容部
            papamamap.animatedMove(coord[0], coord[1], false);
            var content = papamamap.getPopupContent(feature);
            $("#popup-content").html(content);
            $('#popup').show();
            view = map.getView();
            view.setCenter(coord);
        }
    });

    // 中心座標変更セレクトボックス操作イベント定義
    $('#moveTo').change(function() {
        // $('#markerTitle').hide();
        // $('#marker').hide();

        // 指定した最寄り駅に移動
        papamamap.moveToSelectItem(moveToList[$(this).val()]);

        // 地図上にマーカーを設定する
        var lon = moveToList[$(this).val()].lon;
        var lat = moveToList[$(this).val()].lat;
        var label = moveToList[$(this).val()].name;
        var pos = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
        // Vienna marker
        drawMarker(pos, label);
    });

    // 歯科医院チェックボックスのイベント設定
    $('#cbDental').click(function() {
        //console.log("DentalClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 介護施設チェックボックスのイベント設定
    $('#cbWelfare').click(function() {
        //console.log("WelfareClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 社会資源チェックボックスのイベント設定
    $('#cbSociety').click(function() {
        //console.log("SocietyClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 総合事業チェックボックスのイベント設定
    $('#cbOverall').click(function() {
        //console.log("OverallClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 一般介護予防チェックボックスのイベント設定
    $('#cbCareprev').click(function() {
        //console.log("CareprevClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 認知症関連チェックボックスのイベント設定
    $('#cbCognition').click(function() {
        //console.log("CognitionClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 地域の居場所チェックボックスのイベント設定
    $('#cbIbasho').click(function() {
        //console.log("IbashoClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 中学校区チェックボックスのイベント定義
    $('#cbMiddleSchool').click(function() {
        //console.log("MiddleSchoolClick");
        layer = map.getLayers().item(2);
        layer.setVisible($(this).prop('checked'));
    });

    // 病院チェックボックスのイベント定義
    $('#cbHospital').click(function() {
        //console.log("HospitalClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 認知症研修受講医院チェックボックスのイベント定義
    $('#cbDementia').click(function() {
        //console.log("DementiaClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // いきいきサロンチェックボックスのイベント定義
    $('#cbSalon').click(function() {
        //console.log("SalonClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 薬局チェックボックスのイベント定義
    $('#cbDrugStore').click(function() {
        //console.log("DrugStoreClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 地域包括支援センターチェックボックスのイベント定義
    $('#cbHoukatsu').click(function() {
        //console.log("HoukatsuClick");
        papamamap.switchLayer(this.id, $(this).prop('checked'));
    });

    // 現在地に移動するボタンのイベント定義
    $('#moveCurrentLocation').click(function(evt) {
        control = new MoveCurrentLocationControl();
        control.getCurrentPosition(
            function(pos) {
                var coordinate = ol.proj.transform([pos.coords.longitude, pos.coords.latitude], 'EPSG:4326', 'EPSG:3857');
                view = map.getView();
                view.setCenter(coordinate);
                drawMarker(coordinate, "現在地");
            },
            function(err) {
                alert('位置情報が取得できませんでした。');
            }
        );
    });

    // 半径セレクトボックスのイベント定義
    $('#changeCircleRadius').change(function(evt) {
        radius = $(this).val();
        if (radius === "clear") {
            clearCenterCircle();
            $('#cbDisplayCircle').prop('checked', false).checkboxradio('refresh');
            return;
        } else {
            $('#cbDisplayCircle').prop('checked', true).checkboxradio('refresh');
            drawCenterCircle(radius);
        }
    });

    // 円表示ボタンのイベント定義
    $('#cbDisplayCircle').click(function(evt) {
        radius = $('#changeCircleRadius').val();
        if ($('#cbDisplayCircle').prop('checked')) {
            drawCenterCircle(radius);
        } else {
            clearCenterCircle();
        }
    });

    // 地図変更選択ボックス操作時のイベント
    $('#changeBaseMap').change(function(evt) {
        if ($(this).val() === "背景") {
            $(this).val($(this).prop("selectedIndex", 1).val());
        }
        papamamap.changeMapServer(
            mapServerList[$(this).val()], $('#changeOpacity option:selected').val()
        );
    });

    // ポップアップを閉じるイベント
    $('#popup-closer').click(function(evt) {
        $('#popup').hide();
        return;
    });

    // ポップアップを閉じる
    $('.ol-popup').parent('div').click(function(evt) {
        $('#popup').hide();
        return;
    });

    // 親要素へのイベント伝播を停止する
    $('.ol-popup').click(function(evt) {
        evt.stopPropagation();
    });

    // 検索フィルターを有効にする
    //welfare	介護施設
    //ibasho	地域の居場所
    //dental	歯科医院
    //salon		いきいきサロン
    //hospital	医療機関
    //dementia	認知症研修受講医院
    //drugstore	薬局
    //houkatsu	地域包括支援センター
    //society	社会資源
    //overall	総合事業
    //careprev	一般介護予防
    //cognition	認知症関連
    
    // 介護施設	
    $('#filterApply1').click(function(evt) {
        // 条件作成処理
        conditions = [];
        welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = false;
        if ($('#subtype1 option:selected').val() !== "") {
            conditions['subtype1'] = $('#subtype1 option:selected').val();
            welfare = true;
        }
        // フィルター適用時
        if (Object.keys(conditions).length > 0) {
            filter = new FacilityFilter();
            newGeoJson = filter.getFilteredFeaturesGeoJson(conditions, nurseryFacilities);
            papamamap.addNurseryFacilitiesLayer(newGeoJson);
            $('#btnFilter').css('background-color', '#3388cc');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
        } else {
            papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
            welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu =society = overall = careprev = cognition = true;
        }

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: welfare, 
        	ibasho: ibasho, 
        	dental: dental, 
        	salon: salon, 
        	hospital: hospital, 
        	dementia:dementia, 
        	drugstore: drugstore, 
        	houkatsu: houkatsu, 
        	society: society, 
        	overall: overall, 
        	careprev: careprev, 
        	cognition: cognition 
        });
    });
    
    // 社会資源
    $('#filterApply2').click(function(evt) {
        // 条件作成処理
        conditions = [];
        welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = false;
        if ($('#subtype2 option:selected').val() !== "") {
            conditions['subtype2'] = $('#subtype2 option:selected').val();
            society = true;
        }
        // フィルター適用時
        if (Object.keys(conditions).length > 0) {
            filter = new FacilityFilter2();
            newGeoJson = filter.getFilteredFeaturesGeoJson(conditions, nurseryFacilities);
            papamamap.addNurseryFacilitiesLayer(newGeoJson);
            $('#btnFilter2').css('background-color', '#3388cc');
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
        } else {
            papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
            welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = true;
        }

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: welfare, 
        	ibasho: ibasho, 
        	dental: dental, 
        	salon: salon, 
        	hospital: hospital, 
        	dementia:dementia, 
        	drugstore: drugstore, 
        	houkatsu: houkatsu, 
        	society: society, 
        	overall: overall, 
        	careprev: careprev, 
        	cognition: cognition 
        });
    });
    
    // 総合事業
    $('#filterApply3').click(function(evt) {
        // 条件作成処理
        conditions = [];
        welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = false;
        if ($('#subtype3 option:selected').val() !== "") {
            conditions['subtype3'] = $('#subtype3 option:selected').val();
            overall = true;
        }
        // フィルター適用時
        if (Object.keys(conditions).length > 0) {
            filter = new FacilityFilter3();
            newGeoJson = filter.getFilteredFeaturesGeoJson(conditions, nurseryFacilities);
            papamamap.addNurseryFacilitiesLayer(newGeoJson);
            $('#btnFilter3').css('background-color', '#3388cc');
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
        } else {
            papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
            welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = true;
        }

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: welfare, 
        	ibasho: ibasho, 
        	dental: dental, 
        	salon: salon, 
        	hospital: hospital, 
        	dementia:dementia, 
        	drugstore: drugstore, 
        	houkatsu: houkatsu, 
        	society: society, 
        	overall: overall, 
        	careprev: careprev, 
        	cognition: cognition 
        });
    });
    
    // 一般介護予防
    $('#filterApply4').click(function(evt) {
        // 条件作成処理
        conditions = [];
        welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = false;
        if ($('#subtype4 option:selected').val() !== "") {
            conditions['subtype4'] = $('#subtype4 option:selected').val();
            careprev = true;
        }
        // フィルター適用時
        if (Object.keys(conditions).length > 0) {
            filter = new FacilityFilter4();
            newGeoJson = filter.getFilteredFeaturesGeoJson(conditions, nurseryFacilities);
            papamamap.addNurseryFacilitiesLayer(newGeoJson);
            $('#btnFilter4').css('background-color', '#3388cc');
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
        } else {
            papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
            welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = true;
        }

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: welfare, 
        	ibasho: ibasho, 
        	dental: dental, 
        	salon: salon, 
        	hospital: hospital, 
        	dementia:dementia, 
        	drugstore: drugstore, 
        	houkatsu: houkatsu, 
        	society: society, 
        	overall: overall, 
        	careprev: careprev, 
        	cognition: cognition 
        });
    });
    
    // 認知症関連
    $('#filterApply5').click(function(evt) {
        // 条件作成処理
        conditions = [];
        welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = false;
        if ($('#subtype5 option:selected').val() !== "") {
            conditions['subtype5'] = $('#subtype5 option:selected').val();
            cognition = true;
        }
        // フィルター適用時
        if (Object.keys(conditions).length > 0) {
            filter = new FacilityFilter5();
            newGeoJson = filter.getFilteredFeaturesGeoJson(conditions, nurseryFacilities);
            papamamap.addNurseryFacilitiesLayer(newGeoJson);
            $('#btnFilter5').css('background-color', '#3388cc');
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
        } else {
            papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
            $('#btnFilter').css('background-color', '#f6f6f6');
            $('#btnFilter2').css('background-color', '#f6f6f6');
            $('#btnFilter3').css('background-color', '#f6f6f6');
            $('#btnFilter4').css('background-color', '#f6f6f6');
            $('#btnFilter5').css('background-color', '#f6f6f6');
            welfare = ibasho = dental = salon = hospital = dementia = drugstore = houkatsu = society = overall = careprev = cognition = true;
        }

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: welfare, 
        	ibasho: ibasho, 
        	dental: dental, 
        	salon: salon, 
        	hospital: hospital, 
        	dementia:dementia, 
        	drugstore: drugstore, 
        	houkatsu: houkatsu, 
        	society: society, 
        	overall: overall, 
        	careprev: careprev, 
        	cognition: cognition 
        });
    });

    // 元の状態に戻る
    $('#ResetAll').click(function(evt) {
        // チェックボックスをリセット
        $(".filtercb").each(function() {
            $(this).prop('checked', false).checkboxradio('refresh');
        });
        // セレクトボックスをリセット
        $('.filtersb').each(function() {
            $(this).selectmenu(); // これを実行しないと次の行でエラー発生
            $(this).val('').selectmenu('refresh');
        });
        // 施設情報をリセット
        papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
        $('#btnFilter').css('background-color', '#f6f6f6');
        $('#btnFilter2').css('background-color', '#f6f6f6');
        $('#btnFilter3').css('background-color', '#f6f6f6');
        $('#btnFilter4').css('background-color', '#f6f6f6');
        $('#btnFilter5').css('background-color', '#f6f6f6');

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: true, 
        	ibasho: true, 
        	dental: true, 
        	salon: true, 
        	hospital: true, 
        	dementia: true, 
        	drugstore: true, 
        	houkatsu: true, 
        	society: true, 
        	overall:true, 
        	careprev:true, 
        	cognition:true 
        });
        
        clearCenterCircle();
        
    });
    // すべての対象を非表示
    $('#UnDispAll').click(function(evt) {
        // チェックボックスをリセット
        $(".filtercb").each(function() {
            $(this).prop('', true).checkboxradio('refresh');
        });
        // セレクトボックスをリセット
        $('.filtersb').each(function() {
            $(this).selectmenu(); // これを実行しないと次の行でエラー発生
            $(this).val('').selectmenu('refresh');
        });
        // 施設情報をリセット
        papamamap.delNurseryFacilitiesLayer(nurseryFacilities);
        $('#btnFilter').css('background-color', '#f6f6f6');
        $('#btnFilter2').css('background-color', '#f6f6f6');
        $('#btnFilter3').css('background-color', '#f6f6f6');
        $('#btnFilter4').css('background-color', '#f6f6f6');
        $('#btnFilter5').css('background-color', '#f6f6f6');

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: false, 
        	ibasho: false, 
        	dental: false, 
        	salon: false, 
        	hospital: false, 
        	dementia: false, 
        	drugstore: false, 
        	houkatsu: false, 
        	society: false, 
        	overall:false, 
        	careprev:false, 
        	cognition:false 
        });
        
        clearCenterCircle();
        
    });
    // 絞込条件のリセット
    $('#filterReset').click(function(evt) {
        // チェックボックスをリセット
        $(".filtercb").each(function() {
            $(this).prop('checked', false).checkboxradio('refresh');
        });
        // セレクトボックスをリセット
        $('.filtersb').each(function() {
            $(this).selectmenu(); // これを実行しないと次の行でエラー発生
            $(this).val('').selectmenu('refresh');
        });
        // 施設情報をリセット
        papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
        $('#btnFilter').css('background-color', '#f6f6f6');
        $('#btnFilter2').css('background-color', '#f6f6f6');
        $('#btnFilter3').css('background-color', '#f6f6f6');
        $('#btnFilter4').css('background-color', '#f6f6f6');
        $('#btnFilter5').css('background-color', '#f6f6f6');

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: true, 
        	ibasho: true, 
        	dental: true, 
        	salon: true, 
        	hospital: true, 
        	dementia: true, 
        	drugstore: true, 
        	houkatsu: true, 
        	society: true, 
        	overall:true, 
        	careprev:true, 
        	cognition:true 
        });
    });
    $('#filterReset2').click(function(evt) {
        // チェックボックスをリセット
        $(".filtercb").each(function() {
            $(this).prop('checked', false).checkboxradio('refresh');
        });
        // セレクトボックスをリセット
        $('.filtersb').each(function() {
            $(this).selectmenu(); // これを実行しないと次の行でエラー発生
            $(this).val('').selectmenu('refresh');
        });
        // 施設情報をリセット
        papamamap.addNurseryFacilitiesLayer(nurseryFacilities);
        $('#btnFilter').css('background-color', '#f6f6f6');
        $('#btnFilter2').css('background-color', '#f6f6f6');
        $('#btnFilter3').css('background-color', '#f6f6f6');
        $('#btnFilter4').css('background-color', '#f6f6f6');
        $('#btnFilter5').css('background-color', '#f6f6f6');

        // レイヤー表示状態によって施設の表示を切り替える
        updateLayerStatus({ 
        	welfare: true, 
        	ibasho: true, 
        	dental: true, 
        	salon: true, 
        	hospital: true, 
        	dementia: true, 
        	drugstore: true, 
        	houkatsu: true, 
        	society: true, 
        	overall:true, 
        	careprev:true, 
        	cognition:true 
        });
    });

    /**
     * レイヤー状態を切り替える
     *
     * @param  {[type]} checkObj [description]
     * @return {[type]}               [description]
     */
    function updateLayerStatus(checkObj) {
        console.log(checkObj);
        papamamap.switchLayer($('#cbDental').prop('id'), checkObj.dental);
        papamamap.switchLayer($('#cbHospital').prop('id'), checkObj.hospital);
        papamamap.switchLayer($('#cbDrugStore').prop('id'), checkObj.drugstore);
        papamamap.switchLayer($('#cbHoukatsu').prop('id'), checkObj.houkatsu);
        papamamap.switchLayer($('#cbOverall').prop('id'), checkObj.overall);
        papamamap.switchLayer($('#cbCareprev').prop('id'), checkObj.careprev);
        papamamap.switchLayer($('#cbCognition').prop('id'), checkObj.cognition);
        //papamamap.switchLayer($('#cbWelfare').prop('id'), checkObj.welfare);
        //papamamap.switchLayer($('#cbIbasho').prop('id'), checkObj.ibasho);
        //papamamap.switchLayer($('#cbDementia').prop('id'), checkObj.dementia);
        //papamamap.switchLayer($('#cbSalon').prop('id'), checkObj.salon);
        //papamamap.switchLayer($('#cbSociety').prop('id'), checkObj.society);
        
        $('#cbDental').prop('checked', checkObj.dental).checkboxradio('refresh');
        $('#cbHospital').prop('checked', checkObj.hospital).checkboxradio('refresh');
        $('#cbDrugStore').prop('checked', checkObj.drugstore).checkboxradio('refresh');
        $('#cbHoukatsu').prop('checked', checkObj.houkatsu).checkboxradio('refresh');
        $('#cbOverall').prop('checked', checkObj.overall).checkboxradio('refresh');
        $('#cbCareprev').prop('checked', checkObj.careprev).checkboxradio('refresh');
        $('#cbCognition').prop('checked', checkObj.cognition).checkboxradio('refresh');
        //$('#cbWelfare').prop('checked', checkObj.welfare).checkboxradio('refresh');
        //$('#cbIbasho').prop('checked', checkObj.ibasho).checkboxradio('refresh');
        //$('#cbDementia').prop('checked', checkObj.dementia).checkboxradio('refresh');
        //$('#cbSalon').prop('checked', checkObj.salon).checkboxradio('refresh');
        //$('#cbSociety').prop('checked', checkObj.society).checkboxradio('refresh');
    }

    /**
     * 円を描画する 関数内関数
     *
     * @param  {[type]} radius    [description]
     * @return {[type]}           [description]
     */
    function drawCenterCircle(radius) {
        if ($('#cbDisplayCircle').prop('checked')) {
            papamamap.drawCenterCircle(radius);

            $('#center_markerTitle').hide();
            $('#center_marker').hide();

            var center = map.getView().getCenter();
            var coordinate = center;
            var marker = new ol.Overlay({
                position: coordinate,
                positioning: 'center-center',
                element: $('#center_marker'),
                stopEvent: false
            });
            map.addOverlay(marker);

            // 地図マーカーラベル設定
            $('#center_markerTitle').html("");
            var markerTitle = new ol.Overlay({
                position: coordinate,
                element: $('#center_markerTitle')
            });
            map.addOverlay(markerTitle);
            $('#center_markerTitle').show();
            $('#center_marker').show();
        }
    }

    /**
     * 円を消す
     *
     * @return {[type]} [description]
     */
    function clearCenterCircle() {
        papamamap.clearCenterCircle();
        $('#center_markerTitle').hide();
        $('#center_marker').hide();
        $('#changeCircleRadius').val('').selectmenu('refresh');
        return;
    }

    /**
     * 指定座標にマーカーを設定する
     * @param  {[type]} coordinate [description]
     * @return {[type]}            [description]
     */
    function drawMarker(coordinate, label) {
        $('#markerTitle').hide();
        $('#marker').hide();
        var marker = new ol.Overlay({
            position: coordinate,
            positioning: 'center-center',
            element: $('#marker'),
            stopEvent: false
        });
        map.addOverlay(marker);

        // 地図マーカーラベル設定
        $('#markerTitle').html(label);
        var markerTitle = new ol.Overlay({
            position: coordinate,
            element: $('#markerTitle')
        });
        map.addOverlay(markerTitle);
        $('#markerTitle').show();
        $('#marker').show();
        return;
    }

});
