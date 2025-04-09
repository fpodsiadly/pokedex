"use client";

import { useQuery } from '@tanstack/react-query';

const fetchTestData = async (): Promise<{ message: string }> => {
    return { message: "React Query is working!" };
};

export default function TestComponent() {
    const { data, error, isLoading } = useQuery<{ message: string }, Error>({
        queryKey: ['test'],
        queryFn: fetchTestData,
    });

    if (isLoading) return <div>Loading test data...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{data?.message}</div>;
}