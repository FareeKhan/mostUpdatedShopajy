import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../constants/color';

const RemoteImage = ({ uri, style, resizeMode = 'cover', isBorder = true }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fallback = require('../assets/images/men.png')
    useEffect(() => {
        setError(false)
    }, [uri])
    return (
        <View style={[styles.container, style]}>
            {/* {loading && ( */}
            {loading && (
                // <ActivityIndicator
                //     size="small"
                //     color={colors.primary}
                //     style={styles.loader}
                // />
                <Image
                    source={require('../assets/images/loader.png')}
                    style={{ width:"100%",height:100,zIndex:99,resizeMode:"contain",backgroundColor:'#fff',flex:1}}
                    
                />
            )}

            <FastImage
                style={[StyleSheet.absoluteFill, isBorder && styles.borderstyle, style]}
                source={
                    error || !uri
                        ? fallback
                        : { uri, priority: FastImage.priority.normal }
                }
                resizeMode={resizeMode}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
            />
        </View>
    );
};

export default RemoteImage;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    loader: {
        position: 'absolute',
        zIndex: 2,
    },
    borderstyle: {
        borderWidth: 0.3, borderRadius: 8, borderColor: colors.gray9
    }
});
