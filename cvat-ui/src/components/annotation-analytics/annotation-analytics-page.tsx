import React, { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router';

import {
    Alert, Button, Empty, Select, Spin,
} from 'antd';

import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface ClassCount {
    label: string;
    count: number;
}

type State =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; rows: ClassCount[] };

export default function AnnotationAnalyticsPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();

    const [state, setState] = useState<State>({ status: 'loading' });

    const [shapeType, setShapeType] = useState<string>('');

    const load = useCallback(async () => {
        setState({ status: 'loading' });

        try {
            const response = await fetch(
                `/api/test/tasks/${id}/class-counts${shapeType ? `?type=${shapeType}` : ''}`,
                {
                    credentials: 'same-origin',
                },
            );

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            setState({
                status: 'ready',
                rows: await response.json(),
            });
        } catch (error) {
            setState({
                status: 'error',
                message: (error as Error).message,
            });
        }
    }, [id, shapeType]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div style={{ padding: 24, height: '80vh' }}>
            <div style={{ marginBottom: 16 }}>
                <Select
                    value={shapeType}
                    onChange={setShapeType}
                    style={{ width: 180 }}
                    options={[
                        { value: '', label: 'All shape types' },
                        { value: 'rectangle', label: 'Rectangle' },
                        { value: 'polygon', label: 'Polygon' },
                        { value: 'mask', label: 'Mask' },
                        { value: 'polyline', label: 'Polyline' },
                        { value: 'points', label: 'Points' },
                        { value: 'points', label: 'Points' },
                        { value: 'ellipse', label: 'Ellipse' },
                        { value: 'cuboid', label: 'Cuboid' },
                        { value: 'skeleton', label: 'Skeleton' },
                    ]}
                />
            </div>

            {state.status === 'loading' && (
                <Spin style={{ margin: '48px auto', display: 'block' }} />
            )}

            {state.status === 'error' && (
                <Alert
                    type="error"
                    showIcon
                    message="Could not load annotation counts"
                    description={state.message}
                    action={<Button onClick={load}>Retry</Button>}
                />
            )}

            {state.status === 'ready' && state.rows.length === 0 && (
                <Empty description="This task has no annotations yet" />
            )}

            {state.status === 'ready' && state.rows.length > 0 && (
                <Bar
                    data={{
                        labels: state.rows.map((row) => row.label),
                        datasets: [{
                            label: 'Annotations',
                            data: state.rows.map((row) => row.count),
                            backgroundColor: '#1677ff',
                        }],
                    }}
                    options={{
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                        },
                    }}
                />
            )}
        </div>
    );
}