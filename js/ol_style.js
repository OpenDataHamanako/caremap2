/**
 * 保育所背景リスト
 * @type {Object}
 */
var featureStyleList = {
    'default': { color: 'rgba(153, 153, 153, 1)', img: 'image/018.png' },
    '地域の居場所': { color: '#0362A0', img: 'image/019.png' },
    'いきいきサロン': { color: '#AA0000', img: 'image/019.png' },
    '薬局': { color: '#CC66CC', img: 'image/drugstore.png' },
    '社会資源': { color: '#000066', img: 'image/029.png' },
    '総合事業': { color: '#AA0000', img: 'image/018.png' },
    '一般介護予防': { color: '#1BA466', img: 'image/018.png' },
    '認知症関連': { color: '#FF5C24', img: 'image/hospital.png' },
    '福祉施設': { color: '#6EE100', img: 'image/018.png' },
    '認知症研修受講医院': { color: '#6699FF', img: 'image/hospital.png' },
    '地域包括支援センター': { color: '#6699FF', img: 'image/hospital.png' },
    '歯科医院': { color: '#FF5C24', img: 'image/dentist.png' },
    '医療機関': { color: '#1BA466', img: 'image/hospital.png' }
};

/**
 * 総合事業向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var overallStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "総合事業") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 一般介護予防向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var careprevStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "一般介護予防") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 認知症関連向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var cognitionStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "認知症関連") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 社会資源向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var societyStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "社会資源") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 介護施設向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var welfareStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "福祉施設") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 地域の居場所向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var ibashoStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "地域の居場所") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 歯科医院向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var dentalStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    //console.log("DentalStyleFunc");
    if (facilityTypeName === "歯科医院") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 医療機関向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var hospitalStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    //console.log("HospitalStyleFunc");
    if (facilityTypeName === "医療機関") {
    	//console.log("HospitalStyleFunc2");
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};
/**
 * 認知症研修受講医院向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var dementiaStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    //console.log("DementiaStyleFunc");
    if (facilityTypeName === "認知症研修受講医院") {
    	//console.log("DementiaStyleFunc2");
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};
/**
 * いきいきサロン向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var salonStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    //console.log("SalonStyleFunc");
    if (facilityTypeName === "いきいきサロン") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 薬局向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var drugstoreStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "薬局") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 地域包括支援センター向けスタイル
 * @param  {[type]} feature    [description]
 * @param  {[type]} resolution [description]
 * @return {[type]}            [description]
 */
var houkatsuStyleFunction = function(feature, resolution) {
    var facilityTypeName = feature.get('種別') ? feature.get('種別') : feature.get('Type');
    var style = [];
    if (facilityTypeName === "地域包括支援センター") {
        featureStyle = featureStyleList[facilityTypeName];
        style = nurseryStyleFunction(feature, resolution, featureStyle);
    }
    return style;
};

/**
 * 保育施設共通のスタイル定義
 * @param  {[type]} feature      [description]
 * @param  {[type]} resolution   [description]
 * @param  {[type]} featureStyle [description]
 * @return {[type]}              [description]
 */
var nurseryStyleFunction = function(feature, resolution, featureStyle) {
    var radius = 15;
    var background = new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
            color: featureStyle.color
        }),
        stroke: new ol.style.Stroke({ color: 'white', width: 3 })
    });
    var image = new ol.style.Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: featureStyle.img,
        scale: 0.5
    });

    resolution = Math.floor(resolution * 1000);
    var _type = "";
    var label = feature.get('ラベル') ? feature.get('ラベル') : feature.get('Label')
    var text = resolution < 10000 ? label : '';
    var style = [];
    style = [
        new ol.style.Style({ image: background }),
        new ol.style.Style({ image: image }),
    ];

    if (text !== "") {
        style.push(
            new ol.style.Style({
                text: new ol.style.Text({
                    offsetY: -20.0,
                    text: text,
                    font: '14px sans-serif',
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#FFF',
                        width: 3
                    })
                })
            })
        );
    }
    return style;
};

/**
 * ベースの校区スタイルを戻す関数
 * @param  {[type]} mojicolor [description]
 * @param  {[type]} fillcolor [description]
 * @return {[type]}           [description]
 */
function baseSchoolStyle(mojicolor, fillcolor) {
    return function(feature, resolution) {
        var image = new ol.style.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'image/school.png',
            // scale: 0.5
        });

        var background = new ol.style.Circle({
            radius: 15,
            fill: new ol.style.Fill({
                color: mojicolor
            }),
            stroke: new ol.style.Stroke({ color: 'white', width: 3 })
        });

        var style = [
            new ol.style.Style({ image: background }),
            new ol.style.Style({ image: image }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: mojicolor,
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: fillcolor
                })
            })
        ];

        resolution = Math.floor(resolution * 1000);
        var text = "";
        if (feature.get('label') !== null) {
            text = resolution < 12000 ? feature.get('label') : '';
        }
        if (text !== "") {
            style.push(
                new ol.style.Style({
                    text: new ol.style.Text({
                        offsetY: -25.0,
                        text: text,
                        font: '13px sans-serif',
                        fill: new ol.style.Fill({
                            color: mojicolor
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#FFF',
                            width: 3
                        })
                    })
                })
            );
        }
        return style;
    };
}

// 中学校区スタイル
var middleSchoolStyleFunction = baseSchoolStyle(
    '#7379AE', 'rgba(115, 121, 174, 0.1)'
);

// 小学校区スタイル
var elementaryStyleFunction = baseSchoolStyle(
    '#1BA466', 'rgba(27, 164, 102, 0.1)'
);

// 距離計測用同心円の色設定
var circleStyleFunction = function(feature, resolution) {
    resolution = Math.floor(resolution * 1000);
    var text = "";
    if (feature.get('name') !== null) {
        text = resolution < 100000 ? feature.get('name') : '';
    }
    var style = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(238, 149, 44, 0.30)',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(238, 149, 44, 0.30)'
        }),
        text: new ol.style.Text({
            offsetY: -40.0,
            text: text,
            font: '20px sans-serif',
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.4)'
            }),
            stroke: new ol.style.Stroke({
                color: '#FFF',
                width: 3
            })
        })
    })];
    return style;
};