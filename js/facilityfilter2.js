window.FacilityFilter2 = function() {};

/**
 * 指定したフィルター条件に一致する施設情報のGeoJsonを生成する
 *
 * @param  {[type]} conditions        [description]
 * @param  {[type]} nurseryFacilities [description]
 * @return {[type]}                   [description]
 */
FacilityFilter2.prototype.getFilteredFeaturesGeoJson = function(conditions, nurseryFacilities) {
    // 絞り込んだ条件に一致する施設を格納するgeoJsonを準備
    var newGeoJson = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": []
    };

    // 社会資源の検索元データを取得
    var societyFeatures = [];
    _features = nurseryFacilities.features.filter(function(item, idx) {
        var type = item.properties['種別'] ? item.properties['種別'] : item.properties['Type'];
        if (type == "社会資源") return true;
    });
    Array.prototype.push.apply(societyFeatures, _features);

    // ----------------------------------------------------------------------
    // 社会資源向けフィルター
    // ----------------------------------------------------------------------
    if (conditions['subtype2']) {
        filterfunc = function(item, idx) {
            f = function(item, idx) {
                var subtype2 = conditions['subtype2'];
                var type = item.properties['SubType'];
                if (subtype2 == type) {
                    return true;
                }
            };
            return f(item, idx);
        };

        societyFeatures = societyFeatures.filter(filterfunc);
    }
    // 戻り値の作成
    var features = [];
    Array.prototype.push.apply(features, societyFeatures);
    newGeoJson.features = features;
    return newGeoJson;
};
