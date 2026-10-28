import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
    Alert, Button, Empty, Spin,
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

    const load = useCallback(async () => {
        setState({ status: 'loading' });
        try {
            const response = await fetch(`/api/test/tasks/${id}/class-counts`, {
                credentials: 'same-origin',
            });
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            setState({ status: 'ready', rows: await response.json() });
        } catch (error) {
            setState({ status: 'error', message: (error as Error).message });
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    if (state.status === 'loading') {
        return <Spin style={{ margin: '48px auto', display: 'block' }} />;
    }

    if (state.status === 'error') {
        return (
            <Alert
                type='error'
                showIcon
                message='Could not load annotation counts'
                description={state.message}
                action={<Button onClick={load}>Retry</Button>}
            />
        );
    }

    if (state.rows.length === 0) {
        return <Empty description='This task has no annotations yet' />;
    }

    return (
        <div style={{ padding: 24, height: '80vh' }}>
            <Bar
                data={{
                    labels: state.rows.map((row) => row.label),
                    datasets: [{
    label: 'Annotations',
    data: state.rows.map((row) => row.count),
    backgroundColor: '#1677ff',
}],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
            />
        </div>
    );
}