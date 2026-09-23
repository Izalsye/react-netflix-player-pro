import { useState, useEffect } from 'react';
import { Endpoint } from '@/data/endpoints';

// Otomatis bernilai 'true' saat di-build untuk production,
// dan 'false' saat kamu menjalankan server lokal (npm run dev)
const isProduction = process.env.NODE_ENV === 'production';

export function useApiTester(
    endpoint: Endpoint,
    fullUrl: string,
    method: string,
    apiKey: string,
    requireAuth: boolean = isProduction // <-- Menjadikan env sebagai nilai default
) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [testResult, setTestResult] = useState<any>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [responseTime, setResponseTime] = useState<number | null>(null);

    useEffect(() => {
        const initialData: Record<string, string> = {};
        if (endpoint.params) {
            endpoint.params.forEach(p => { initialData[p.name] = p.default || ''; });
        }
        setFormData(initialData);
    }, [endpoint]);

    const executeTest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTesting(true);
        setTestResult(null);
        setResponseTime(null);

        const startTime = Date.now();

        // Validasi akan otomatis mati di lokal, dan hidup di production
        if (requireAuth && !apiKey) {
            setTestResult({ error: "Missing API Key. Silakan login terlebih dahulu." });
            setIsTesting(false);
            return;
        }

        try {
            const url = new URL(fullUrl);
            const bodyPayload: Record<string, string> = {};

            endpoint.params?.forEach(p => {
                const val = formData[p.name];
                if (val) {
                    if (p.in === 'query') url.searchParams.append(p.name, val);
                    else if (p.in === 'body') bodyPayload[p.name] = val;
                }
            });

            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            // Pasang API key ke header jika ada isinya
            if (apiKey) {
                headers['x-api-key'] = apiKey;
            }

            const options: RequestInit = {
                method,
                headers,
                cache: 'no-store'
            };

            if ((method === 'POST' || method === 'PUT') && Object.keys(bodyPayload).length > 0) {
                options.body = JSON.stringify(bodyPayload);
            }

            const res = await fetch(url.toString(), options);
            const data = await res.json();
            setTestResult(data);
        } catch (error: any) {
            setTestResult({ error: error.message || "Gagal menghubungi server." });
        } finally {
            setResponseTime(Date.now() - startTime);
            setIsTesting(false);
        }
    };

    return { formData, setFormData, isTesting, testResult, responseTime, executeTest };
}