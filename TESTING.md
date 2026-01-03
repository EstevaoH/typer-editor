# Guia de Testes - Typer Editor

Este documento fornece um guia completo sobre como escrever e executar testes no projeto Typer Editor.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Executando Testes](#executando-testes)
- [Estrutura de Testes](#estrutura-de-testes)
- [Escrevendo Testes](#escrevendo-testes)
- [Boas Práticas](#boas-práticas)
- [Exemplos](#exemplos)

## Visão Geral

O projeto utiliza as seguintes ferramentas de teste:

- **Jest**: Framework de testes JavaScript
- **React Testing Library**: Biblioteca para testar componentes React
- **@testing-library/user-event**: Simulação de interações do usuário
- **@testing-library/jest-dom**: Matchers customizados para assertions

## Executando Testes

### Comandos Disponíveis

```bash
# Executar todos os testes uma vez
npm test

# Executar testes em modo watch (re-executa ao modificar arquivos)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Executar Testes Específicos

```bash
# Executar testes de um arquivo específico
npm test Header.test.tsx

# Executar testes que correspondem a um padrão
npm test -- --testNamePattern="renders"

# Executar apenas testes de uma pasta
npm test src/components/landing
```

## Estrutura de Testes

Os testes são organizados em pastas `__tests__` próximas aos arquivos que testam:

```
src/
├── components/
│   ├── landing/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── __tests__/
│   │       ├── Header.test.tsx
│   │       └── Footer.test.tsx
├── hooks/
│   ├── useDebounce.ts
│   └── __tests__/
│       └── useDebounce.test.ts
└── utils/
    ├── htmlToPlainText.ts
    └── __tests__/
        └── htmlToPlainText.test.ts
```

## Escrevendo Testes

### 1. Testes de Componentes React

```tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders the component', () => {
    render(<MyComponent />)
    
    const element = screen.getByText('Hello World')
    expect(element).toBeInTheDocument()
  })
  
  it('handles user interaction', async () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 2. Testes de Hooks Customizados

```tsx
import { renderHook, act } from '@testing-library/react'
import { useMyHook } from '../useMyHook'

describe('useMyHook', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => useMyHook('initial'))
    
    expect(result.current).toBe('initial')
  })
  
  it('updates value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useMyHook(value),
      { initialProps: { value: 'initial' } }
    )
    
    rerender({ value: 'updated' })
    
    expect(result.current).toBe('updated')
  })
})
```

### 3. Testes de Funções Utilitárias

```tsx
import { myUtilityFunction } from '../myUtility'

describe('myUtilityFunction', () => {
  it('processes input correctly', () => {
    const input = 'test input'
    const result = myUtilityFunction(input)
    
    expect(result).toBe('expected output')
  })
  
  it('handles edge cases', () => {
    expect(myUtilityFunction('')).toBe('')
    expect(myUtilityFunction(null)).toBe(null)
  })
})
```

## Boas Práticas

### ✅ Faça

1. **Teste comportamento, não implementação**
   ```tsx
   // ✅ Bom - testa o que o usuário vê
   expect(screen.getByText('Submit')).toBeInTheDocument()
   
   // ❌ Ruim - testa detalhes de implementação
   expect(component.state.isSubmitting).toBe(false)
   ```

2. **Use queries acessíveis**
   ```tsx
   // ✅ Bom - usa role acessível
   screen.getByRole('button', { name: /submit/i })
   
   // ❌ Ruim - usa classe CSS
   screen.getByClassName('submit-button')
   ```

3. **Organize testes com describe e it**
   ```tsx
   describe('LoginForm', () => {
     describe('when user is logged out', () => {
       it('shows login button', () => {
         // test
       })
     })
     
     describe('when user is logged in', () => {
       it('shows logout button', () => {
         // test
       })
     })
   })
   ```

4. **Use beforeEach para setup comum**
   ```tsx
   describe('MyComponent', () => {
     let mockFn
     
     beforeEach(() => {
       mockFn = jest.fn()
     })
     
     it('test 1', () => {
       // mockFn está limpo aqui
     })
     
     it('test 2', () => {
       // mockFn está limpo aqui também
     })
   })
   ```

### ❌ Evite

1. **Testes muito específicos** - Podem quebrar com mudanças pequenas
2. **Testar múltiplas coisas em um teste** - Dificulta identificar falhas
3. **Depender de ordem de execução** - Testes devem ser independentes
4. **Ignorar testes falhando** - Corrija ou remova testes quebrados

## Exemplos

### Exemplo 1: Testando Renderização de Componente

```tsx
import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

describe('Header Component', () => {
  it('renders logo and navigation', () => {
    render(<Header onOpenContact={jest.fn()} />)
    
    // Verifica se o logo está presente
    expect(screen.getByAltText('TyperEditor Logo')).toBeInTheDocument()
    
    // Verifica se os links de navegação estão presentes
    expect(screen.getByText('Recursos')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })
})
```

### Exemplo 2: Testando Interações do Usuário

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../ContactForm'

describe('ContactForm', () => {
  it('submits form with user input', async () => {
    const handleSubmit = jest.fn()
    render(<ContactForm onSubmit={handleSubmit} />)
    
    // Simula usuário digitando
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe')
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com')
    
    // Simula clique no botão
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    // Verifica se o callback foi chamado
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    })
  })
})
```

### Exemplo 3: Testando Hooks com Timers

```tsx
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  
  afterEach(() => {
    jest.useRealTimers()
  })
  
  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )
    
    // Muda o valor
    rerender({ value: 'updated' })
    
    // Valor ainda não deve ter mudado
    expect(result.current).toBe('initial')
    
    // Avança o tempo
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Agora o valor deve ter mudado
    expect(result.current).toBe('updated')
  })
})
```

### Exemplo 4: Testando Funções Utilitárias

```tsx
import { htmlToPlainText } from '../htmlToPlainText'

describe('htmlToPlainText', () => {
  it('removes HTML tags', () => {
    const html = '<p>Hello <strong>World</strong></p>'
    const result = htmlToPlainText(html)
    
    expect(result).toBe('Hello World')
  })
  
  it('handles empty input', () => {
    expect(htmlToPlainText('')).toBe('')
  })
  
  it('decodes HTML entities', () => {
    const html = 'Hello&nbsp;World &amp; Friends'
    const result = htmlToPlainText(html)
    
    expect(result).toBe('Hello World & Friends')
  })
})
```

## Matchers Úteis

### Jest Matchers

```tsx
expect(value).toBe(expected)              // Igualdade estrita (===)
expect(value).toEqual(expected)           // Igualdade profunda
expect(value).toBeTruthy()                // Valor truthy
expect(value).toBeFalsy()                 // Valor falsy
expect(value).toBeNull()                  // null
expect(value).toBeUndefined()             // undefined
expect(value).toBeDefined()               // Não undefined
expect(array).toContain(item)             // Array contém item
expect(string).toMatch(/pattern/)         // String match regex
expect(fn).toHaveBeenCalled()             // Função foi chamada
expect(fn).toHaveBeenCalledWith(arg)      // Função chamada com arg
expect(fn).toHaveBeenCalledTimes(n)       // Função chamada n vezes
```

### Testing Library Matchers

```tsx
expect(element).toBeInTheDocument()       // Elemento está no DOM
expect(element).toBeVisible()             // Elemento está visível
expect(element).toHaveTextContent(text)   // Elemento tem texto
expect(element).toHaveAttribute(attr)     // Elemento tem atributo
expect(element).toHaveClass(className)    // Elemento tem classe
expect(input).toHaveValue(value)          // Input tem valor
expect(checkbox).toBeChecked()            // Checkbox está marcado
expect(button).toBeDisabled()             // Botão está desabilitado
```

## Queries do Testing Library

### Ordem de Prioridade (do mais acessível ao menos)

1. **getByRole** - Melhor para acessibilidade
   ```tsx
   screen.getByRole('button', { name: /submit/i })
   ```

2. **getByLabelText** - Para inputs com labels
   ```tsx
   screen.getByLabelText(/email/i)
   ```

3. **getByPlaceholderText** - Para inputs com placeholder
   ```tsx
   screen.getByPlaceholderText(/enter email/i)
   ```

4. **getByText** - Para elementos com texto
   ```tsx
   screen.getByText(/hello world/i)
   ```

5. **getByAltText** - Para imagens
   ```tsx
   screen.getByAltText(/logo/i)
   ```

6. **getByTestId** - Último recurso
   ```tsx
   screen.getByTestId('custom-element')
   ```

## Debugging

### Ver o DOM atual

```tsx
import { screen } from '@testing-library/react'

// Imprime o DOM completo
screen.debug()

// Imprime um elemento específico
screen.debug(screen.getByRole('button'))
```

### Usar logRoles para ver roles disponíveis

```tsx
import { logRoles } from '@testing-library/react'

const { container } = render(<MyComponent />)
logRoles(container)
```

## Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Dica**: Comece testando os casos de uso mais importantes e expanda gradualmente a cobertura de testes!
