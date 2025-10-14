"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react"
import { MiniChart } from "@/components/mini-chart"

// Datos de ejemplo para criptomonedas
const cryptoData = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 67234.56,
    change24h: 2.34,
    sparkline: [65000, 65500, 64800, 66000, 66500, 67000, 67234],
    holdings: 0.5,
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change24h: -1.23,
    sparkline: [3500, 3480, 3520, 3490, 3470, 3450, 3456],
    holdings: 5.2,
  },
  {
    id: 3,
    name: "Cardano",
    symbol: "ADA",
    price: 0.5678,
    change24h: 5.67,
    sparkline: [0.52, 0.53, 0.54, 0.55, 0.56, 0.565, 0.5678],
    holdings: 1000,
  },
  {
    id: 4,
    name: "Solana",
    symbol: "SOL",
    price: 145.32,
    change24h: 3.45,
    sparkline: [140, 141, 142, 143, 144, 145, 145.32],
    holdings: 15,
  },
  {
    id: 5,
    name: "Polkadot",
    symbol: "DOT",
    price: 7.89,
    change24h: -2.34,
    sparkline: [8.1, 8.0, 7.95, 7.92, 7.9, 7.88, 7.89],
    holdings: 200,
  },
  {
    id: 6,
    name: "Ripple",
    symbol: "XRP",
    price: 0.6234,
    change24h: 1.89,
    sparkline: [0.61, 0.612, 0.615, 0.618, 0.62, 0.622, 0.6234],
    holdings: 5000,
  },
]

const currencies = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "JPY", symbol: "¥", rate: 149.5 },
]

export function CryptoDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  const currentCurrency = currencies.find((c) => c.code === selectedCurrency) || currencies[0]

  // Calcular métricas del portafolio
  const portfolioMetrics = useMemo(() => {
    const totalValue = cryptoData.reduce(
      (sum, crypto) => sum + crypto.price * crypto.holdings * currentCurrency.rate,
      0,
    )

    const change24h =
      cryptoData.reduce((sum, crypto) => sum + (crypto.price * crypto.holdings * crypto.change24h) / 100, 0) *
      currentCurrency.rate

    const allTimeHigh = totalValue * 1.15 // Simulado

    return {
      totalValue,
      change24h,
      change24hPercent: (change24h / totalValue) * 100,
      allTimeHigh,
    }
  }, [currentCurrency])

  // Filtrar criptomonedas por búsqueda
  const filteredCrypto = useMemo(() => {
    return cryptoData.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  const formatCurrency = (value: number) => {
    return `${currentCurrency.symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Criptomonedas</h1>
          <p className="text-muted-foreground mt-1">Seguimiento en tiempo real de tu portafolio</p>
        </div>
        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total del Portafolio</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(portfolioMetrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Actualizado hace 1 minuto</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ganancia/Pérdida 24h</CardTitle>
            {portfolioMetrics.change24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${portfolioMetrics.change24h >= 0 ? "text-success" : "text-destructive"}`}
            >
              {portfolioMetrics.change24h >= 0 ? "+" : ""}
              {formatCurrency(portfolioMetrics.change24h)}
            </div>
            <p className={`text-xs mt-1 ${portfolioMetrics.change24h >= 0 ? "text-success" : "text-destructive"}`}>
              {portfolioMetrics.change24h >= 0 ? "+" : ""}
              {portfolioMetrics.change24hPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Máximo Histórico</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(portfolioMetrics.allTimeHigh)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(
                ((portfolioMetrics.totalValue - portfolioMetrics.allTimeHigh) / portfolioMetrics.allTimeHigh) *
                100
              ).toFixed(2)}
              % desde ATH
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos en Portafolio</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{cryptoData.length}</div>
            <p className="text-xs text-success mt-1">+{cryptoData.filter((c) => c.change24h > 0).length} en alza</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar criptomoneda..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border text-foreground"
        />
      </div>

      {/* Tabla de activos */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Seguimiento de Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Precio Actual</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Cambio 24h</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Holdings</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Valor Total</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Últimos 7 días</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrypto.map((crypto) => (
                  <tr key={crypto.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{crypto.symbol.substring(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{crypto.name}</div>
                          <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-foreground">
                      {formatCurrency(crypto.price * currentCurrency.rate)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          crypto.change24h >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {crypto.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {crypto.change24h >= 0 ? "+" : ""}
                        {crypto.change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-muted-foreground">
                      {crypto.holdings.toLocaleString()} {crypto.symbol}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-medium text-foreground">
                      {formatCurrency(crypto.price * crypto.holdings * currentCurrency.rate)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end">
                        <MiniChart data={crypto.sparkline} positive={crypto.change24h >= 0} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
