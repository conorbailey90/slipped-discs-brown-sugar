/**
 * <image-slot>: lightweight static-site version.
 *
 * Renders the image at `src` filling its (positioned) container. If `src` is
 * missing or fails to load, it shows a tinted placeholder with the text from
 * the `placeholder` attribute. This mirrors the design-handoff component's
 * layout behaviour without the drag-drop / persistence bits, which aren't
 * needed for a plain static site.
 *
 * Attributes:
 *   src          Image URL to display.
 *   placeholder  Caption shown when there's no image.
 *   fit          object-fit value (default "cover").
 *   shape        rect | rounded | circle | pill (affects border-radius).
 *   radius       corner radius in px for shape="rounded" (default 12).
 */
class ImageSlot extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    const src = this.getAttribute('src');
    const placeholder = this.getAttribute('placeholder') || '';
    const fit = this.getAttribute('fit') || 'cover';

    this.style.position = this.style.position || 'absolute';
    this.style.inset = '0';
    this.style.display = 'block';
    this.style.overflow = 'hidden';
    this.style.borderRadius = this._radius();

    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = placeholder;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = fit;
      img.style.display = 'block';
      img.addEventListener('error', () => {
        img.remove();
        this.appendChild(this._placeholderEl(placeholder));
      });
      this.appendChild(img);
    } else {
      this.appendChild(this._placeholderEl(placeholder));
    }
  }

  _radius() {
    const shape = this.getAttribute('shape') || 'rounded';
    if (shape === 'circle') return '50%';
    if (shape === 'pill') return '999px';
    if (shape === 'rect') return '0';
    return (this.getAttribute('radius') || '12') + 'px';
  }

  _placeholderEl(text) {
    const d = document.createElement('div');
    d.textContent = text;
    d.style.cssText =
      'width:100%;height:100%;display:flex;align-items:center;justify-content:center;' +
      'text-align:center;padding:18px;box-sizing:border-box;font-size:13px;line-height:1.4;' +
      'color:#8A7A80;background:linear-gradient(135deg,#DCE9EB,#F1E9DA);' +
      "font-family:Karla,system-ui,sans-serif;";
    return d;
  }
}

if (!customElements.get('image-slot')) {
  customElements.define('image-slot', ImageSlot);
}
