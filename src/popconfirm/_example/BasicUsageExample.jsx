import React, { useState } from 'react';
import { Button } from '@tdesign/react';
import PopConfirm from '../PopConfirm';

export default function ExtendsExample() {
    const $content = '请确认您要进行此操作';

    const handleConfirm = (e) => {
        console.log('confirm button clicked!', e);
    };

    const handleCancel = (e) => {
        console.log('confirm button clicked!', e);
    };

    return (
        <>
            <PopConfirm
                content={$content}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            >
                <Button theme="primary" style={{ marginLeft: 8 }}>
                    Hover展示
        </Button>
            </PopConfirm>
        </>
    );
}
