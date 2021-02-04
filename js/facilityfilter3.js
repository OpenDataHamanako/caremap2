window.FacilityFilter3 = function() {};

/**
 * 指定したフィルター条件に一致する施設情報のGeoJsonを生成する
 *
 * @param  {[type]} conditions        [description]
 * @param  {[type]} nurseryFacilities [description]
 * @return {[type]}                   [description]
 */
FacilityFilter3.prototype.getFilteredFeaturesGeoJson = function(conditions, nurseryFacilities) {
    // 絞り込んだ条件に一致する施設を格納するgeoJsonを準備
    var newGeoJson = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": []
    };

    // 社会資源の検索元データを取得
    var overallFeatures = [];
    _features = nurseryFacilities.features.filter(function(item, idx) {
        var type = item.properties['種別'] ? item.properties['種別'] : item.properties['Type'];
        if (type == "総合事業") return true;
    });
    Array.prototype.push.apply(overallFeatures, _features);

    // ----------------------------------------------------------------------
    // 社会資源向けフィルター
    // ----------------------------------------------------------------------
    if (conditions['subtype3']) {
        filterfunc = function(item, idx) {
            f = function(item, idx) {
                var subtype3 = conditions['subtype3'];
                var type = item.properties['SubType'];
                if (subtype3 == type) {
                    return true;
                }
            };
            return f(item, idx);
        };

        overallFeatures = overallFeatures.filter(filterfunc);
    }
    // 戻り値の作成
    var features = [];
    Array.prototype.push.apply(features, overallFeatures);
    newGeoJson.features = features;
    return newGeoJson;
};
