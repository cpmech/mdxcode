# Test

## Python code

For example:

```python
print('generate y-x graph using Python')
x = np.linspace(0, 2*np.pi, 31)
y = np.sin(x)
plt.plot(x, y)
plt.show()
```

## Julia code

For example:

```julia {.julia .cb.nb}
using Fmt
y(x) = -x^3
dydx(x) = -3*x^2
xn = 1.0
correct = dydx(xn)
println("correct dydx = $correct")
for i = 2:10
    dx = 0.2/i
    xl = xn-dx
    xr = xn+dx
    dydx_fwd = (y(xr)-y(xn))/dx
    dydx_bwd = (y(xn)-y(xl))/dx
    dydx_cen = (y(xr)-y(xl))/(2*dx)
    print("dydx is approx. equal to ")
    print(f"{$dydx_fwd:.3f} or ")
    print(f"{$dydx_bwd:.3f} or ")
    print(f"{$dydx_cen:.3f}\n")
end
```

where we can see that the central difference calculates values closer to the correct solution.
